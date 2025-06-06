
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

    // Hide all buttons during capture
    const buttons = element.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.style.display = 'none';
    });

    // Create PDF with landscape orientation for better card layout
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Card dimensions (credit card size)
    const cardWidth = 85.6; // mm
    const cardHeight = 54; // mm
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    
    const cardX = (pageWidth - cardWidth) / 2;
    const frontY = 40;
    const backY = frontY + cardHeight + 30;

    if (includeBothSides) {
      // Get the current state
      const cardElement = element.querySelector('[class*="w-\\[400px\\]"]') as HTMLElement;
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Find flip button
      const flipButton = element.querySelector('button[data-flip="true"]') as HTMLButtonElement;
      if (!flipButton) {
        throw new Error('Flip button not found');
      }

      // Get current state from button text
      const isShowingBack = flipButton.textContent?.includes('Show Front') || false;
      console.log('Current state - showing back:', isShowingBack);

      // Ensure we start with front side
      if (isShowingBack) {
        console.log('Switching to front side');
        flipButton.click();
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Capture front side
      console.log('Capturing front side for PDF');
      const frontCanvas = await html2canvas(cardElement, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        removeContainer: true,
        logging: false,
        width: 400,
        height: 250
      });

      // Add front side to PDF
      const frontImgData = frontCanvas.toDataURL('image/png');
      pdf.addImage(frontImgData, 'PNG', cardX, frontY, cardWidth, cardHeight);
      
      // Add label
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text('FRONT SIDE', cardX, frontY - 5);

      // Switch to back side
      console.log('Switching to back side');
      flipButton.click();
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Capture back side
      console.log('Capturing back side for PDF');
      const backCanvas = await html2canvas(cardElement, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        removeContainer: true,
        logging: false,
        width: 400,
        height: 250
      });

      // Add back side to PDF
      const backImgData = backCanvas.toDataURL('image/png');
      pdf.addImage(backImgData, 'PNG', cardX, backY, cardWidth, cardHeight);
      pdf.text('BACK SIDE', cardX, backY - 5);

      // Restore to original state
      if (!isShowingBack) {
        flipButton.click();
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } else {
      // Single side capture
      const cardElement = element.querySelector('[class*="w-\\[400px\\]"]') as HTMLElement;
      const canvas = await html2canvas(cardElement, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        removeContainer: true,
        logging: false,
        width: 400,
        height: 250
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', cardX, frontY, cardWidth, cardHeight);
    }

    // Restore buttons
    buttons.forEach(btn => {
      btn.style.display = '';
    });

    // Save PDF
    pdf.save(`${fileName}.pdf`);
    console.log('PDF saved successfully');
    return true;
  } catch (error) {
    console.error('PDF generation failed:', error);
    return false;
  }
};

export const downloadCardImage = async (elementId: string, fileName: string, includeBothSides = true) => {
  try {
    console.log('Starting image download for element:', elementId);
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Hide buttons
    const buttons = element.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.style.display = 'none';
    });

    const cardElement = element.querySelector('[class*="w-\\[400px\\]"]') as HTMLElement;
    if (!cardElement) {
      throw new Error('Card element not found');
    }

    if (includeBothSides) {
      // Find flip button
      const flipButton = element.querySelector('button[data-flip="true"]') as HTMLButtonElement;
      if (!flipButton) {
        throw new Error('Flip button not found');
      }

      // Create combined canvas
      const combinedCanvas = document.createElement('canvas');
      const ctx = combinedCanvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      const scale = 3;
      const cardWidth = 400 * scale;
      const cardHeight = 250 * scale;
      const gap = 60;
      
      combinedCanvas.width = cardWidth;
      combinedCanvas.height = cardHeight * 2 + gap * 3;

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);

      // Get current state
      const isShowingBack = flipButton.textContent?.includes('Show Front') || false;

      // Ensure front side first
      if (isShowingBack) {
        flipButton.click();
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Capture front
      const frontCanvas = await html2canvas(cardElement, {
        scale: scale,
        useCORS: true,
        backgroundColor: null,
        removeContainer: true,
        logging: false,
        width: 400,
        height: 250
      });

      // Draw front side
      ctx.font = 'bold 36px Arial';
      ctx.fillStyle = '#333333';
      ctx.textAlign = 'center';
      ctx.fillText('FRONT SIDE', combinedCanvas.width / 2, 50);
      ctx.drawImage(frontCanvas, 0, gap);

      // Switch to back
      flipButton.click();
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Capture back
      const backCanvas = await html2canvas(cardElement, {
        scale: scale,
        useCORS: true,
        backgroundColor: null,
        removeContainer: true,
        logging: false,
        width: 400,
        height: 250
      });

      // Draw back side
      const backY = gap + cardHeight + gap;
      ctx.fillText('BACK SIDE', combinedCanvas.width / 2, backY + 50);
      ctx.drawImage(backCanvas, 0, backY + gap);

      // Restore original state
      if (!isShowingBack) {
        flipButton.click();
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Download
      const link = document.createElement('a');
      link.download = `${fileName}-both-sides.png`;
      link.href = combinedCanvas.toDataURL('image/png');
      link.click();
    } else {
      // Single side
      const canvas = await html2canvas(cardElement, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        removeContainer: true,
        logging: false,
        width: 400,
        height: 250
      });

      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }

    // Restore buttons
    buttons.forEach(btn => {
      btn.style.display = '';
    });

    return true;
  } catch (error) {
    console.error('Image download failed:', error);
    return false;
  }
};

export const printCard = (elementId: string, includeBothSides = true) => {
  try {
    console.log('Starting print for element:', elementId);
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Get person data from the element
    const nameElement = element.querySelector('[class*="font-bold"][class*="text-lg"]');
    const idElement = element.querySelector('[class*="font-mono"]');
    const name = nameElement?.textContent || 'Unknown';
    const personalId = idElement?.textContent?.replace('ID: ', '') || 'Unknown';

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Could not open print window');
    }

    let printContent = '';

    if (includeBothSides) {
      printContent = `
        <div class="print-container">
          <div class="card-side">
            <div class="side-label">FRONT SIDE</div>
            <div class="id-card front-card">
              <div class="card-header">
                <h4>MYANMAR DIGITAL ID</h4>
                <div class="gradient-line"></div>
              </div>
              <div class="card-content">
                <div class="avatar">${name.charAt(0)}</div>
                <div class="info">
                  <h5>${name}</h5>
                  <div class="details">
                    <div><span class="label">ID:</span> <span class="value">${personalId}</span></div>
                    <div><span class="label">NRC:</span> <span class="value">12/MAKANA(N)123456</span></div>
                    <div><span class="label">DOB:</span> <span class="value">1990-05-15</span></div>
                  </div>
                  <div class="badges">
                    <div class="badge citizen">CITIZEN</div>
                    <div class="badge active">ACTIVE</div>
                  </div>
                </div>
                <div class="qr-section">
                  <div class="qr-code">QR</div>
                  <div class="qr-label">SCAN</div>
                </div>
              </div>
              <div class="card-footer">
                <span>Serial: SC-${personalId}</span>
                <span>Exp: 12/2029</span>
              </div>
            </div>
          </div>
          
          <div class="card-side">
            <div class="side-label">BACK SIDE</div>
            <div class="id-card back-card">
              <div class="card-header">
                <h4>REPUBLIC OF THE UNION OF MYANMAR</h4>
                <h3>DIGITAL IDENTITY CARD</h3>
                <div class="gradient-line"></div>
              </div>
              <div class="card-content">
                <div class="qr-section">
                  <div class="qr-code large">QR</div>
                  <div class="verify-text">SCAN TO VERIFY</div>
                  <div class="auth-text">Digital Auth</div>
                </div>
                <div class="info-section">
                  <div class="info-box">
                    <h5>VERIFICATION GUIDE</h5>
                    <div class="guide-text">
                      <p>• Scan QR using official eID app</p>
                      <p>• Visit eid.gov.mm for verification</p>
                      <p>• Check digital signature</p>
                      <p>• Verify national database</p>
                    </div>
                  </div>
                  <div class="info-box">
                    <h5>CARD INFORMATION</h5>
                    <div class="card-info">
                      <div><span>Issue:</span> <span>15 Jan 2024</span></div>
                      <div><span>Expiry:</span> <span>31 Dec 2029</span></div>
                      <div><span>Authority:</span> <span>Digital ID Dept</span></div>
                      <div><span>Serial:</span> <span>MID${personalId}</span></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-footer">
                <span>eid.gov.mm/verify</span>
                <div class="secure-badge">
                  <span>🛡</span>
                  <span>SECURE</span>
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
                <div class="gradient-line"></div>
              </div>
              <div class="card-content">
                <div class="avatar">${name.charAt(0)}</div>
                <div class="info">
                  <h5>${name}</h5>
                  <div class="details">
                    <div><span class="label">ID:</span> <span class="value">${personalId}</span></div>
                    <div><span class="label">NRC:</span> <span class="value">12/MAKANA(N)123456</span></div>
                    <div><span class="label">DOB:</span> <span class="value">1990-05-15</span></div>
                  </div>
                  <div class="badges">
                    <div class="badge citizen">CITIZEN</div>
                    <div class="badge active">ACTIVE</div>
                  </div>
                </div>
                <div class="qr-section">
                  <div class="qr-code">QR</div>
                  <div class="qr-label">SCAN</div>
                </div>
              </div>
              <div class="card-footer">
                <span>Serial: SC-${personalId}</span>
                <span>Exp: 12/2029</span>
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
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: system-ui, -apple-system, sans-serif;
              background: white;
              padding: 20px;
            }
            
            .print-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 40px;
            }
            
            .card-side {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 15px;
              page-break-inside: avoid;
            }
            
            .side-label {
              font-weight: bold;
              font-size: 16px;
              color: #333;
              text-align: center;
            }
            
            .id-card {
              width: 400px;
              height: 250px;
              background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%);
              border-radius: 16px;
              padding: 24px;
              color: white;
              position: relative;
              overflow: hidden;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
              border: 1px solid rgba(71, 85, 105, 0.5);
            }
            
            .card-header {
              text-align: center;
              margin-bottom: 20px;
            }
            
            .card-header h4 {
              font-size: 18px;
              font-weight: bold;
              letter-spacing: 2px;
              margin-bottom: 8px;
            }
            
            .card-header h3 {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 8px;
            }
            
            .gradient-line {
              width: 64px;
              height: 2px;
              background: linear-gradient(to right, #60a5fa, #34d399);
              margin: 0 auto;
            }
            
            .front-card .card-content {
              display: flex;
              align-items: center;
              gap: 16px;
              height: 120px;
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
              flex-shrink: 0;
            }
            
            .info {
              flex: 1;
            }
            
            .info h5 {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 8px;
              letter-spacing: 1px;
            }
            
            .details {
              margin-bottom: 12px;
            }
            
            .details div {
              margin: 4px 0;
              font-size: 14px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            
            .label {
              color: #bfdbfe;
              font-weight: 500;
              min-width: 35px;
            }
            
            .value {
              font-family: monospace;
            }
            
            .badges {
              display: flex;
              gap: 8px;
            }
            
            .badge {
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 10px;
              font-weight: bold;
            }
            
            .citizen {
              background: rgba(16, 185, 129, 0.8);
            }
            
            .active {
              background: rgba(59, 130, 246, 0.8);
            }
            
            .qr-section {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 8px;
              flex-shrink: 0;
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
              font-size: 12px;
            }
            
            .qr-code.large {
              width: 80px;
              height: 80px;
              font-size: 14px;
            }
            
            .qr-label {
              font-size: 10px;
              font-weight: bold;
              color: #bfdbfe;
            }
            
            .verify-text {
              font-size: 10px;
              font-weight: bold;
              text-align: center;
              color: #bfdbfe;
            }
            
            .auth-text {
              font-size: 8px;
              color: #93c5fd;
            }
            
            .back-card .card-content {
              display: flex;
              gap: 16px;
              height: 140px;
            }
            
            .info-section {
              flex: 1;
              display: flex;
              flex-direction: column;
              gap: 12px;
            }
            
            .info-box {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 8px;
              padding: 12px;
              backdrop-filter: blur(4px);
            }
            
            .info-box h5 {
              font-size: 10px;
              font-weight: bold;
              margin-bottom: 8px;
              color: #bfdbfe;
            }
            
            .guide-text p, .card-info div {
              font-size: 8px;
              margin: 2px 0;
              line-height: 1.3;
            }
            
            .card-info div {
              display: flex;
              justify-content: space-between;
            }
            
            .card-info span:first-child {
              color: #bfdbfe;
            }
            
            .card-footer {
              position: absolute;
              bottom: 12px;
              left: 24px;
              right: 24px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 12px;
              color: rgba(191, 219, 254, 0.8);
              border-top: 1px solid rgba(255, 255, 255, 0.2);
              padding-top: 8px;
            }
            
            .secure-badge {
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 10px;
              font-weight: bold;
            }
            
            @media print {
              body { 
                margin: 0; 
                padding: 10mm; 
              }
              .print-container { 
                gap: 20mm; 
              }
              .card-side { 
                page-break-after: always; 
              }
              .card-side:last-child { 
                page-break-after: auto; 
              }
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
    }, 1000);

    return true;
  } catch (error) {
    console.error('Print failed:', error);
    return false;
  }
};
