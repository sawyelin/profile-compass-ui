
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
    const backY = (pageHeight - cardHeight) / 2 + 30;

    if (includeBothSides) {
      // Find the flip button more reliably
      const flipButton = Array.from(buttons).find(btn => 
        btn.textContent?.includes('Show') || 
        btn.getAttribute('data-flip') === 'true'
      ) as HTMLButtonElement;
      
      console.log('Found flip button:', flipButton?.textContent);

      // Ensure we start with front side
      let currentShowingBack = flipButton?.textContent?.includes('Show Front') || false;
      console.log('Currently showing back:', currentShowingBack);

      if (currentShowingBack) {
        console.log('Flipping to front side first');
        flipButton?.click();
        await new Promise(resolve => setTimeout(resolve, 1000)); // Increased delay
      }

      // Capture front side
      console.log('Capturing front side');
      const frontCanvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 400,
        height: 250,
        logging: false
      });

      const frontImgData = frontCanvas.toDataURL('image/png');
      pdf.addImage(frontImgData, 'PNG', frontX, frontY, cardWidth, cardHeight);
      
      // Add labels
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text('FRONT SIDE', frontX, frontY - 5);

      // Flip to back side
      console.log('Flipping to back side');
      if (flipButton) {
        flipButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000)); // Increased delay
        
        // Capture back side
        console.log('Capturing back side');
        const backCanvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          width: 400,
          height: 250,
          logging: false
        });

        const backImgData = backCanvas.toDataURL('image/png');
        pdf.addImage(backImgData, 'PNG', frontX, backY, cardWidth, cardHeight);
        pdf.text('BACK SIDE', frontX, backY - 5);

        // Flip back to front
        console.log('Flipping back to front');
        flipButton.click();
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } else {
      // Single side
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 400,
        height: 250,
        logging: false
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

    // For print, we'll create a static version with both sides
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error('Could not open print window');
      throw new Error('Could not open print window');
    }

    // Get person data from the element or context
    const nameElement = element.querySelector('[class*="font-bold"][class*="text-lg"]');
    const idElement = element.querySelector('[class*="font-mono"]');
    const name = nameElement?.textContent || 'Unknown';
    const personalId = idElement?.textContent || 'Unknown';

    let printContent = '';

    if (includeBothSides) {
      printContent = `
        <div class="print-container">
          <div class="card-side">
            <div class="side-label">FRONT SIDE</div>
            <div class="id-card front-card">
              <div class="card-header">
                <h4>MYANMAR DIGITAL ID</h4>
              </div>
              <div class="card-content">
                <div class="avatar">${name.charAt(0)}</div>
                <div class="info">
                  <h5>${name}</h5>
                  <div class="details">
                    <div>ID: ${personalId}</div>
                    <div>Status: ACTIVE</div>
                  </div>
                </div>
                <div class="qr-code">QR</div>
              </div>
            </div>
          </div>
          <div class="card-side">
            <div class="side-label">BACK SIDE</div>
            <div class="id-card back-card">
              <div class="card-header">
                <h4>REPUBLIC OF THE UNION OF MYANMAR</h4>
                <h3>DIGITAL IDENTITY CARD</h3>
              </div>
              <div class="card-content">
                <div class="qr-section">
                  <div class="qr-code">QR</div>
                  <div class="verify-text">SCAN TO VERIFY</div>
                </div>
                <div class="info-section">
                  <div class="verification-guide">
                    <h5>VERIFICATION GUIDE</h5>
                    <p>• Scan QR using official eID app</p>
                    <p>• Visit eid.gov.mm for verification</p>
                  </div>
                  <div class="card-info">
                    <h5>CARD INFORMATION</h5>
                    <p>Issue: 15 Jan 2024</p>
                    <p>Expiry: 31 Dec 2029</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      printContent = `
        <div class="print-container">
          <div class="card-side">
            <div class="id-card front-card">
              <div class="card-header">
                <h4>MYANMAR DIGITAL ID</h4>
              </div>
              <div class="card-content">
                <div class="avatar">${name.charAt(0)}</div>
                <div class="info">
                  <h5>${name}</h5>
                  <div class="details">
                    <div>ID: ${personalId}</div>
                    <div>Status: ACTIVE</div>
                  </div>
                </div>
                <div class="qr-code">QR</div>
              </div>
            </div>
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
            .id-card {
              width: 400px;
              height: 250px;
              background: linear-gradient(to bottom right, #0f172a, #1e3a8a, #0f172a);
              border-radius: 16px;
              padding: 24px;
              color: white;
              position: relative;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            }
            .card-header {
              text-align: center;
              margin-bottom: 16px;
            }
            .card-header h4 {
              font-size: 18px;
              font-weight: bold;
              margin: 0;
            }
            .card-header h3 {
              font-size: 16px;
              font-weight: bold;
              margin: 4px 0 0 0;
            }
            .card-content {
              display: flex;
              align-items: center;
              gap: 16px;
              height: 140px;
            }
            .avatar {
              width: 80px;
              height: 80px;
              border: 2px solid rgba(255, 255, 255, 0.6);
              border-radius: 50%;
              background: white;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #0f172a;
              font-weight: bold;
              font-size: 24px;
            }
            .info {
              flex: 1;
            }
            .info h5 {
              font-size: 18px;
              font-weight: bold;
              margin: 0 0 8px 0;
            }
            .details div {
              margin: 4px 0;
              font-size: 14px;
            }
            .qr-code {
              width: 60px;
              height: 60px;
              background: white;
              color: black;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 8px;
              font-weight: bold;
            }
            .back-card .card-content {
              flex-direction: row;
              justify-content: space-between;
            }
            .qr-section {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 8px;
            }
            .verify-text {
              font-size: 10px;
              font-weight: bold;
              text-align: center;
            }
            .info-section {
              flex: 1;
              margin-left: 16px;
            }
            .verification-guide, .card-info {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 8px;
              padding: 12px;
              margin-bottom: 12px;
            }
            .verification-guide h5, .card-info h5 {
              font-size: 10px;
              font-weight: bold;
              margin: 0 0 8px 0;
            }
            .verification-guide p, .card-info p {
              font-size: 8px;
              margin: 2px 0;
              line-height: 1.2;
            }
            @media print {
              body { margin: 0; padding: 10mm; }
              .print-container { gap: 15mm; }
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

      // Find the flip button more reliably
      const flipButton = Array.from(buttons).find(btn => 
        btn.textContent?.includes('Show') || 
        btn.getAttribute('data-flip') === 'true'
      ) as HTMLButtonElement;
      
      console.log('Found flip button for image:', flipButton?.textContent);

      // Ensure we start with front side
      let currentShowingBack = flipButton?.textContent?.includes('Show Front') || false;
      console.log('Currently showing back for image:', currentShowingBack);

      if (currentShowingBack) {
        console.log('Flipping to front side first for image');
        flipButton?.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Capture front side
      console.log('Capturing front side for image');
      const frontCanvas = await html2canvas(element, {
        scale: scale,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 400,
        height: 250,
        logging: false
      });

      // Draw front side label and card
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#333333';
      ctx.textAlign = 'center';
      ctx.fillText('FRONT SIDE', combinedCanvas.width / 2, 40);
      ctx.drawImage(frontCanvas, 0, gap);

      // Flip to back side and capture
      console.log('Flipping to back side for image');
      if (flipButton) {
        flipButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Capturing back side for image');
        const backCanvas = await html2canvas(element, {
          scale: scale,
          useCORS: true,
          backgroundColor: '#ffffff',
          width: 400,
          height: 250,
          logging: false
        });

        // Draw back side label and card
        const backY = gap + cardHeight + gap;
        ctx.fillText('BACK SIDE', combinedCanvas.width / 2, backY + 40);
        ctx.drawImage(backCanvas, 0, backY + gap);

        // Flip back to front
        console.log('Flipping back to front for image');
        flipButton.click();
        await new Promise(resolve => setTimeout(resolve, 500));
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
        height: 250,
        logging: false
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
