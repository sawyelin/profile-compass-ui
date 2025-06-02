
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

    console.log('Element found, generating canvas...');

    // Hide buttons and interactive elements during capture
    const buttons = element.querySelectorAll('button');
    buttons.forEach(btn => btn.style.display = 'none');

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Capture front side
    const frontCanvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      width: 400,
      height: 250
    });

    const frontImgData = frontCanvas.toDataURL('image/png');
    
    // Add front side to PDF (centered)
    const cardWidth = 85.6; // Credit card width in mm
    const cardHeight = 54; // Credit card height in mm
    const pageWidth = 297; // A4 width in mm
    const pageHeight = 210; // A4 height in mm
    
    const frontX = (pageWidth - cardWidth) / 2;
    const frontY = (pageHeight - cardHeight) / 2 - 30; // Position front card higher
    
    pdf.addImage(frontImgData, 'PNG', frontX, frontY, cardWidth, cardHeight);
    pdf.text('FRONT SIDE', frontX, frontY - 5);

    if (includeBothSides) {
      // Trigger flip to back side
      const flipButton = element.querySelector('button[data-flip="true"]') as HTMLButtonElement;
      if (flipButton) {
        flipButton.click();
        
        // Wait for flip animation and re-render
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Capture back side
        const backCanvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: null,
          width: 400,
          height: 250
        });

        const backImgData = backCanvas.toDataURL('image/png');
        
        // Add back side to PDF (below front)
        const backY = (pageHeight - cardHeight) / 2 + 30;
        pdf.addImage(backImgData, 'PNG', frontX, backY, cardWidth, cardHeight);
        pdf.text('BACK SIDE', frontX, backY - 5);

        // Flip back to front
        flipButton.click();
      }
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

    const cardHtml = element.outerHTML;
    console.log('Opening print window with card HTML');
    
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
            }
            .side-label {
              font-weight: bold;
              font-size: 14px;
              color: #333;
            }
            button {
              display: none !important;
            }
            @media print {
              body { margin: 0; padding: 10mm; }
              .print-container { min-height: auto; gap: 15mm; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="card-side">
              <div class="side-label">FRONT SIDE</div>
              ${cardHtml}
            </div>
            ${includeBothSides ? `
            <div class="card-side">
              <div class="side-label">BACK SIDE</div>
              ${cardHtml.replace('showBack={false}', 'showBack={true}')}
            </div>
            ` : ''}
          </div>
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
      combinedCanvas.width = 400 * 3; // Scale factor
      combinedCanvas.height = 250 * 2 * 3 + 60; // Two cards + gap

      // Capture front side
      const frontCanvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 400,
        height: 250
      });

      // Draw front side
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#333333';
      ctx.textAlign = 'center';
      ctx.fillText('FRONT SIDE', combinedCanvas.width / 2, 40);
      ctx.drawImage(frontCanvas, 0, 60);

      // Trigger flip to back side
      const flipButton = element.querySelector('button[data-flip="true"]') as HTMLButtonElement;
      if (flipButton) {
        flipButton.click();
        await new Promise(resolve => setTimeout(resolve, 500));

        // Capture back side
        const backCanvas = await html2canvas(element, {
          scale: 3,
          useCORS: true,
          backgroundColor: '#ffffff',
          width: 400,
          height: 250
        });

        // Draw back side
        const backY = 60 + 250 * 3 + 60;
        ctx.fillText('BACK SIDE', combinedCanvas.width / 2, backY - 20);
        ctx.drawImage(backCanvas, 0, backY);

        // Flip back to front
        flipButton.click();
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
        backgroundColor: null,
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
