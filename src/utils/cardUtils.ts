
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Helper function to wait for DOM updates
const waitForDOM = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to hide buttons during capture
const hideButtons = (element: HTMLElement) => {
  const buttons = element.querySelectorAll('button');
  buttons.forEach(btn => {
    (btn as HTMLElement).style.display = 'none';
  });
  return buttons;
};

// Helper function to restore buttons after capture
const restoreButtons = (buttons: NodeListOf<Element>) => {
  buttons.forEach(btn => {
    (btn as HTMLElement).style.display = '';
  });
};

export const generateCardPDF = async (elementId: string, fileName: string, includeBothSides = true) => {
  try {
    console.log('Starting PDF generation for element:', elementId);
    const containerElement = document.getElementById(elementId);
    if (!containerElement) {
      console.error('Container element not found:', elementId);
      return false;
    }

    // Find the actual card element
    const cardElement = containerElement.querySelector('.w-\\[400px\\]') as HTMLElement;
    if (!cardElement) {
      console.error('Card element not found');
      return false;
    }

    // Hide all buttons during capture
    const buttons = hideButtons(containerElement);

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Card dimensions
    const cardWidth = 85.6;
    const cardHeight = 54;
    const pageWidth = 210;
    const cardX = (pageWidth - cardWidth) / 2;
    const frontY = 40;
    const backY = frontY + cardHeight + 30;

    if (includeBothSides) {
      // Find flip button by looking for the button with RotateCcw icon or "Show" text
      const flipButton = Array.from(containerElement.querySelectorAll('button')).find(btn => 
        btn.textContent?.includes('Show') || btn.querySelector('[data-lucide="rotate-ccw"]')
      ) as HTMLButtonElement;

      if (!flipButton) {
        console.error('Flip button not found');
        restoreButtons(buttons);
        return false;
      }

      // Determine current state
      const isShowingBack = flipButton.textContent?.includes('Show Front');
      console.log('Current state - showing back:', isShowingBack);

      // Ensure we start with front side
      if (isShowingBack) {
        console.log('Switching to front side');
        flipButton.click();
        await waitForDOM(2000); // Wait longer for state change
      }

      // Capture front side
      console.log('Capturing front side');
      await waitForDOM(500); // Additional wait for stability
      
      const frontCanvas = await html2canvas(cardElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        width: 400,
        height: 250,
        onclone: (clonedDoc) => {
          // Ensure the cloned element has the right styles
          const clonedCard = clonedDoc.querySelector('.w-\\[400px\\]') as HTMLElement;
          if (clonedCard) {
            clonedCard.style.width = '400px';
            clonedCard.style.height = '250px';
          }
        }
      });

      if (frontCanvas.width === 0 || frontCanvas.height === 0) {
        console.error('Front canvas is empty');
        restoreButtons(buttons);
        return false;
      }

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
      await waitForDOM(2000); // Wait for flip animation and state change

      // Capture back side
      console.log('Capturing back side');
      await waitForDOM(500);
      
      const backCanvas = await html2canvas(cardElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        width: 400,
        height: 250,
        onclone: (clonedDoc) => {
          const clonedCard = clonedDoc.querySelector('.w-\\[400px\\]') as HTMLElement;
          if (clonedCard) {
            clonedCard.style.width = '400px';
            clonedCard.style.height = '250px';
          }
        }
      });

      if (backCanvas.width === 0 || backCanvas.height === 0) {
        console.error('Back canvas is empty');
        restoreButtons(buttons);
        return false;
      }

      // Add back side to PDF
      const backImgData = backCanvas.toDataURL('image/png');
      pdf.addImage(backImgData, 'PNG', cardX, backY, cardWidth, cardHeight);
      pdf.text('BACK SIDE', cardX, backY - 5);

      // Restore original state if needed
      if (!isShowingBack) {
        console.log('Restoring to front side');
        flipButton.click();
        await waitForDOM(1000);
      }
    } else {
      // Single side capture
      const canvas = await html2canvas(cardElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        width: 400,
        height: 250
      });

      if (canvas.width === 0 || canvas.height === 0) {
        console.error('Canvas is empty');
        restoreButtons(buttons);
        return false;
      }

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', cardX, frontY, cardWidth, cardHeight);
    }

    // Restore buttons
    restoreButtons(buttons);

    // Save PDF
    pdf.save(`${fileName}.pdf`);
    console.log('PDF generated successfully');
    return true;
  } catch (error) {
    console.error('PDF generation failed:', error);
    return false;
  }
};

export const downloadCardImage = async (elementId: string, fileName: string, includeBothSides = true) => {
  try {
    console.log('Starting image download for element:', elementId);
    const containerElement = document.getElementById(elementId);
    if (!containerElement) {
      console.error('Container element not found');
      return false;
    }

    const cardElement = containerElement.querySelector('.w-\\[400px\\]') as HTMLElement;
    if (!cardElement) {
      console.error('Card element not found');
      return false;
    }

    // Hide buttons
    const buttons = hideButtons(containerElement);

    if (includeBothSides) {
      // Find flip button
      const flipButton = Array.from(containerElement.querySelectorAll('button')).find(btn => 
        btn.textContent?.includes('Show') || btn.querySelector('[data-lucide="rotate-ccw"]')
      ) as HTMLButtonElement;

      if (!flipButton) {
        console.error('Flip button not found');
        restoreButtons(buttons);
        return false;
      }

      // Create combined canvas
      const combinedCanvas = document.createElement('canvas');
      const ctx = combinedCanvas.getContext('2d');
      if (!ctx) {
        console.error('Canvas context not available');
        restoreButtons(buttons);
        return false;
      }

      const scale = 2;
      const cardWidth = 400 * scale;
      const cardHeight = 250 * scale;
      const gap = 40 * scale;
      
      combinedCanvas.width = cardWidth;
      combinedCanvas.height = cardHeight * 2 + gap * 3;

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);

      // Get current state
      const isShowingBack = flipButton.textContent?.includes('Show Front');

      // Ensure front side first
      if (isShowingBack) {
        flipButton.click();
        await waitForDOM(2000);
      }

      // Capture front
      await waitForDOM(500);
      const frontCanvas = await html2canvas(cardElement, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        width: 400,
        height: 250
      });

      if (frontCanvas.width === 0 || frontCanvas.height === 0) {
        console.error('Front canvas is empty for image');
        restoreButtons(buttons);
        return false;
      }

      // Draw front side
      ctx.font = `bold ${24 * scale}px Arial`;
      ctx.fillStyle = '#333333';
      ctx.textAlign = 'center';
      ctx.fillText('FRONT SIDE', combinedCanvas.width / 2, 30 * scale);
      ctx.drawImage(frontCanvas, 0, gap);

      // Switch to back
      flipButton.click();
      await waitForDOM(2000);

      // Capture back
      await waitForDOM(500);
      const backCanvas = await html2canvas(cardElement, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        width: 400,
        height: 250
      });

      if (backCanvas.width === 0 || backCanvas.height === 0) {
        console.error('Back canvas is empty for image');
        restoreButtons(buttons);
        return false;
      }

      // Draw back side
      const backY = gap + cardHeight + gap;
      ctx.fillText('BACK SIDE', combinedCanvas.width / 2, backY + 30 * scale);
      ctx.drawImage(backCanvas, 0, backY + gap);

      // Restore original state
      if (!isShowingBack) {
        flipButton.click();
        await waitForDOM(1000);
      }

      // Download
      const link = document.createElement('a');
      link.download = `${fileName}-both-sides.png`;
      link.href = combinedCanvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Single side
      const canvas = await html2canvas(cardElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        width: 400,
        height: 250
      });

      if (canvas.width === 0 || canvas.height === 0) {
        console.error('Single canvas is empty');
        restoreButtons(buttons);
        return false;
      }

      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    // Restore buttons
    restoreButtons(buttons);
    console.log('Image download completed successfully');
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

    // Get person data safely
    const nameElement = element.querySelector('h5');
    const idElements = element.querySelectorAll('.font-mono');
    const name = nameElement?.textContent || 'Unknown';
    const personalId = idElements[0]?.textContent || 'Unknown';
    const nrc = idElements[1]?.textContent || '12/MAKANA(N)123456';

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Could not open print window');
    }

    let printContent = '';

    if (includeBothSides) {
      printContent = `
        <div class="print-container">
          <div class="card-page">
            <h2 class="page-title">FRONT SIDE</h2>
            <div class="id-card front-card">
              <div class="security-badges">
                <div class="badge secure">🛡 SECURE</div>
                <div class="badge verified">✓ VERIFIED</div>
              </div>
              <div class="card-header">
                <h3>MYANMAR DIGITAL ID</h3>
                <div class="gradient-line"></div>
              </div>
              <div class="card-content">
                <div class="avatar">${name.charAt(0)}</div>
                <div class="info">
                  <h4>${name}</h4>
                  <div class="details">
                    <div><span class="label">ID:</span> <span class="value">${personalId}</span></div>
                    <div><span class="label">NRC:</span> <span class="value">${nrc}</span></div>
                    <div><span class="label">DOB:</span> <span class="value">1990-05-15</span></div>
                  </div>
                  <div class="status-badges">
                    <div class="status-badge citizen">✓ CITIZEN</div>
                    <div class="status-badge active">★ ACTIVE</div>
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
          
          <div class="card-page">
            <h2 class="page-title">BACK SIDE</h2>
            <div class="id-card back-card">
              <div class="security-badges">
                <div class="badge official">🛡 OFFICIAL</div>
                <div class="badge authentic">✓ AUTHENTIC</div>
              </div>
              <div class="card-header">
                <h4>REPUBLIC OF THE UNION OF MYANMAR</h4>
                <h3>DIGITAL IDENTITY CARD</h3>
                <div class="gradient-line"></div>
              </div>
              <div class="card-content-back">
                <div class="qr-section-large">
                  <div class="qr-code-large">QR</div>
                  <div class="verify-info">
                    <div class="verify-title">SCAN TO VERIFY</div>
                    <div class="auth-text">Digital Auth</div>
                  </div>
                </div>
                <div class="info-section">
                  <div class="info-box">
                    <h5>VERIFICATION GUIDE</h5>
                    <div class="guide-list">
                      <div>• Scan QR using official eID app</div>
                      <div>• Visit eid.gov.mm for verification</div>
                      <div>• Check digital signature</div>
                      <div>• Verify national database</div>
                    </div>
                  </div>
                  <div class="info-box">
                    <h5>CARD INFORMATION</h5>
                    <div class="card-details">
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
                <div class="secure-indicator">
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
          <div class="card-page">
            <div class="id-card front-card">
              <div class="security-badges">
                <div class="badge secure">🛡 SECURE</div>
                <div class="badge verified">✓ VERIFIED</div>
              </div>
              <div class="card-header">
                <h3>MYANMAR DIGITAL ID</h3>
                <div class="gradient-line"></div>
              </div>
              <div class="card-content">
                <div class="avatar">${name.charAt(0)}</div>
                <div class="info">
                  <h4>${name}</h4>
                  <div class="details">
                    <div><span class="label">ID:</span> <span class="value">${personalId}</span></div>
                    <div><span class="label">NRC:</span> <span class="value">${nrc}</span></div>
                    <div><span class="label">DOB:</span> <span class="value">1990-05-15</span></div>
                  </div>
                  <div class="status-badges">
                    <div class="status-badge citizen">✓ CITIZEN</div>
                    <div class="status-badge active">★ ACTIVE</div>
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
              color: #333;
            }
            
            .print-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 40px;
            }
            
            .card-page {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 20px;
              page-break-inside: avoid;
              page-break-after: always;
            }
            
            .card-page:last-child {
              page-break-after: auto;
            }
            
            .page-title {
              font-size: 18px;
              font-weight: bold;
              color: #333;
              text-align: center;
              margin-bottom: 10px;
            }
            
            .id-card {
              width: 400px;
              height: 250px;
              background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%);
              border-radius: 16px;
              padding: 20px;
              color: white;
              position: relative;
              overflow: hidden;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
              border: 2px solid #1e40af;
            }
            
            .security-badges {
              position: absolute;
              top: 8px;
              left: 8px;
              right: 8px;
              display: flex;
              justify-content: space-between;
              z-index: 10;
            }
            
            .badge {
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 10px;
              font-weight: bold;
              color: white;
            }
            
            .secure { background: rgba(16, 185, 129, 0.9); }
            .verified { background: rgba(59, 130, 246, 0.9); }
            .official { background: rgba(16, 185, 129, 0.9); }
            .authentic { background: rgba(59, 130, 246, 0.9); }
            
            .card-header {
              text-align: center;
              margin: 30px 0 20px 0;
            }
            
            .card-header h3 {
              font-size: 18px;
              font-weight: bold;
              letter-spacing: 2px;
              margin-bottom: 8px;
            }
            
            .card-header h4 {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 4px;
            }
            
            .gradient-line {
              width: 64px;
              height: 3px;
              background: linear-gradient(to right, #60a5fa, #34d399);
              margin: 0 auto;
              border-radius: 2px;
            }
            
            .card-content {
              display: flex;
              align-items: center;
              gap: 16px;
              height: 100px;
            }
            
            .card-content-back {
              display: flex;
              gap: 16px;
              height: 120px;
            }
            
            .avatar {
              width: 80px;
              height: 80px;
              border: 3px solid rgba(255, 255, 255, 0.8);
              border-radius: 50%;
              background: linear-gradient(135deg, #ffffff, #f1f5f9);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #0f172a;
              font-weight: bold;
              font-size: 28px;
              flex-shrink: 0;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
            
            .info {
              flex: 1;
            }
            
            .info h4 {
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
              font-weight: 600;
              min-width: 35px;
            }
            
            .value {
              font-family: 'Courier New', monospace;
              font-weight: 500;
            }
            
            .status-badges {
              display: flex;
              gap: 8px;
            }
            
            .status-badge {
              padding: 4px 8px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: bold;
            }
            
            .citizen {
              background: rgba(16, 185, 129, 0.8);
              color: white;
            }
            
            .active {
              background: rgba(59, 130, 246, 0.8);
              color: white;
            }
            
            .qr-section {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 8px;
              flex-shrink: 0;
            }
            
            .qr-section-large {
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
              color: #000;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 8px;
              font-weight: bold;
              font-size: 12px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            
            .qr-code-large {
              width: 80px;
              height: 80px;
              background: white;
              color: #000;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 8px;
              font-weight: bold;
              font-size: 14px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            
            .qr-label {
              font-size: 10px;
              font-weight: bold;
              color: #bfdbfe;
            }
            
            .verify-info {
              text-align: center;
            }
            
            .verify-title {
              font-size: 10px;
              font-weight: bold;
              color: #bfdbfe;
              margin-bottom: 2px;
            }
            
            .auth-text {
              font-size: 8px;
              color: #93c5fd;
            }
            
            .info-section {
              flex: 1;
              display: flex;
              flex-direction: column;
              gap: 12px;
            }
            
            .info-box {
              background: rgba(255, 255, 255, 0.15);
              border-radius: 8px;
              padding: 10px;
              backdrop-filter: blur(4px);
              border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .info-box h5 {
              font-size: 10px;
              font-weight: bold;
              margin-bottom: 6px;
              color: #bfdbfe;
              letter-spacing: 0.5px;
            }
            
            .guide-list div, .card-details div {
              font-size: 8px;
              margin: 2px 0;
              line-height: 1.4;
            }
            
            .card-details div {
              display: flex;
              justify-content: space-between;
              font-family: 'Courier New', monospace;
            }
            
            .card-details span:first-child {
              color: #bfdbfe;
              font-weight: 500;
            }
            
            .card-footer {
              position: absolute;
              bottom: 8px;
              left: 20px;
              right: 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 11px;
              color: rgba(191, 219, 254, 0.9);
              border-top: 1px solid rgba(255, 255, 255, 0.2);
              padding-top: 6px;
              font-family: 'Courier New', monospace;
            }
            
            .secure-indicator {
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
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .print-container { 
                gap: 20mm; 
              }
              .id-card {
                box-shadow: none;
                border: 2px solid #1e40af;
              }
            }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 1000);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
    console.log('Print window opened successfully');
    return true;
  } catch (error) {
    console.error('Print failed:', error);
    return false;
  }
};
