
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generateCardPDF = async (elementId: string, fileName: string, includeBothSides = true) => {
  try {
    console.log('Starting PDF generation for element:', elementId);
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found:', elementId);
      throw new Error('Element not found');
    }

    // Hide buttons and interactive elements during capture
    const buttons = element.querySelectorAll('button');
    buttons.forEach(btn => btn.style.display = 'none');

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Card dimensions
    const cardWidth = 85.6; // Credit card width in mm
    const cardHeight = 54; // Credit card height in mm
    const pageWidth = 297; // A4 width in mm
    const pageHeight = 210; // A4 height in mm
    
    const frontX = (pageWidth - cardWidth) / 2;
    const frontY = (pageHeight - cardHeight) / 2 - 30;

    if (includeBothSides) {
      // Ensure we start with front side
      const flipButton = element.querySelector('button[data-flip="true"]') as HTMLButtonElement;
      const cardContainer = element.querySelector('.w-\\[400px\\]');
      
      // Check current state and force to front
      if (flipButton && flipButton.textContent?.includes('Show Front')) {
        flipButton.click();
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      // Capture front side
      const frontCanvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 400,
        height: 250
      });

      const frontImgData = frontCanvas.toDataURL('image/png');
      pdf.addImage(frontImgData, 'PNG', frontX, frontY, cardWidth, cardHeight);
      pdf.text('FRONT SIDE', frontX, frontY - 5);

      // Flip to back side
      if (flipButton) {
        flipButton.click();
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Capture back side
        const backCanvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          width: 400,
          height: 250
        });

        const backImgData = backCanvas.toDataURL('image/png');
        const backY = (pageHeight - cardHeight) / 2 + 30;
        pdf.addImage(backImgData, 'PNG', frontX, backY, cardWidth, cardHeight);
        pdf.text('BACK SIDE', frontX, backY - 5);

        // Flip back to front
        flipButton.click();
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    } else {
      // Single side
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 400,
        height: 250
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', frontX, frontY, cardWidth, cardHeight);
    }

    // Restore buttons
    buttons.forEach(btn => btn.style.display = '');

    pdf.save(`${fileName}.pdf`);
    console.log('PDF saved successfully');
    return true;
  } catch (error) {
    console.error('PDF generation failed:', error);
    return false;
  }
};

export const printCard = (elementId: string, includeBothSides = true) => {
  try {
    console.log('Starting print for element:', elementId);
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found:', elementId);
      throw new Error('Element not found');
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error('Could not open print window');
      throw new Error('Could not open print window');
    }

    // Get the current card HTML
    const cardElement = element.querySelector('.w-\\[400px\\]');
    if (!cardElement) {
      throw new Error('Card element not found');
    }

    let printContent = '';

    if (includeBothSides) {
      // Create both sides for printing
      printContent = `
        <div class="print-container">
          <div class="card-side">
            <div class="side-label">FRONT SIDE</div>
            <div class="w-[400px] h-[250px] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl border border-slate-700/50">
              <!-- Front side content will be injected -->
            </div>
          </div>
          <div class="card-side">
            <div class="side-label">BACK SIDE</div>
            <div class="w-[400px] h-[250px] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 rounded-2xl p-5 text-white relative overflow-hidden shadow-2xl border border-slate-700/50">
              <!-- Back side content will be injected -->
            </div>
          </div>
        </div>
      `;
    } else {
      printContent = `
        <div class="print-container">
          <div class="card-side">
            ${cardElement.outerHTML}
          </div>
        </div>
      `;
    }
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>ID Card Print</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: system-ui, -apple-system, sans-serif;
              background: white;
            }
            .print-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 30px;
              min-height: 80vh;
            }
            .card-side {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 10px;
              page-break-inside: avoid;
            }
            .side-label {
              font-weight: bold;
              font-size: 14px;
              color: #333;
              margin-bottom: 10px;
            }
            button {
              display: none !important;
            }
            @media print {
              body { margin: 0; padding: 10mm; }
              .print-container { min-height: auto; gap: 15mm; }
              .card-side { page-break-after: always; }
              .card-side:last-child { page-break-after: auto; }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);

    console.log('Print job sent successfully');
    return true;
  } catch (error) {
    console.error('Print failed:', error);
    return false;
  }
};

export const downloadCardImage = async (elementId: string, fileName: string, includeBothSides = true) => {
  try {
    console.log('Starting image download for element:', elementId);
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found:', elementId);
      throw new Error('Element not found');
    }

    // Hide buttons during capture
    const buttons = element.querySelectorAll('button');
    buttons.forEach(btn => btn.style.display = 'none');

    if (includeBothSides) {
      // Create a canvas for both sides
      const combinedCanvas = document.createElement('canvas');
      const ctx = combinedCanvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      // Set canvas size for both cards
      const scale = 3;
      const cardWidth = 400 * scale;
      const cardHeight = 250 * scale;
      const gap = 60;
      
      combinedCanvas.width = cardWidth;
      combinedCanvas.height = cardHeight * 2 + gap * 3;

      // Fill background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);

      const flipButton = element.querySelector('button[data-flip="true"]') as HTMLButtonElement;
      
      // Ensure we start with front side
      if (flipButton && flipButton.textContent?.includes('Show Front')) {
        flipButton.click();
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      // Capture front side
      const frontCanvas = await html2canvas(element, {
        scale: scale,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 400,
        height: 250
      });

      // Draw front side label and card
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#333333';
      ctx.textAlign = 'center';
      ctx.fillText('FRONT SIDE', combinedCanvas.width / 2, 40);
      ctx.drawImage(frontCanvas, 0, gap);

      // Flip to back side and capture
      if (flipButton) {
        flipButton.click();
        await new Promise(resolve => setTimeout(resolve, 600));

        const backCanvas = await html2canvas(element, {
          scale: scale,
          useCORS: true,
          backgroundColor: '#ffffff',
          width: 400,
          height: 250
        });

        // Draw back side label and card
        const backY = gap + cardHeight + gap;
        ctx.fillText('BACK SIDE', combinedCanvas.width / 2, backY + 40);
        ctx.drawImage(backCanvas, 0, backY + gap);

        // Flip back to front
        flipButton.click();
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Download combined image
      const link = document.createElement('a');
      link.download = `${fileName}-both-sides.png`;
      link.href = combinedCanvas.toDataURL('image/png');
      link.click();
    } else {
      // Single side download
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 400,
        height: 250
      });

      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }

    // Restore buttons
    buttons.forEach(btn => btn.style.display = '');

    console.log('Image downloaded successfully');
    return true;
  } catch (error) {
    console.error('Image download failed:', error);
    return false;
  }
};
