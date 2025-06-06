
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

// Helper function to find flip button by data-flip attribute
const findFlipButton = (containerElement: HTMLElement): HTMLButtonElement | null => {
  const flipButton = containerElement.querySelector('button[data-flip="true"]') as HTMLButtonElement;
  if (flipButton) {
    console.log('Found flip button with data-flip attribute');
    return flipButton;
  }
  
  // Fallback: look for button with "Show" text
  const buttons = Array.from(containerElement.querySelectorAll('button'));
  const fallbackButton = buttons.find(btn => 
    btn.textContent?.includes('Show')
  ) as HTMLButtonElement;
  
  if (fallbackButton) {
    console.log('Found flip button by text content');
    return fallbackButton;
  }
  
  console.log('No flip button found');
  return null;
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

    // Create PDF with A4 size
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // A4 dimensions: 210 x 297 mm
    // Standard credit card size: 85.6 x 54 mm
    const cardWidth = 85.6;
    const cardHeight = 54;
    const pageWidth = 210;
    const pageHeight = 297;
    
    // Center cards on page
    const cardX = (pageWidth - cardWidth) / 2;
    const frontY = 60;
    const backY = frontY + cardHeight + 40;

    if (includeBothSides) {
      // Find flip button using the correct method
      const flipButton = findFlipButton(containerElement);
      
      if (!flipButton) {
        console.error('Flip button not found');
        restoreButtons(buttons);
        return false;
      }

      // Determine current state by checking button text
      const isShowingBack = flipButton.textContent?.includes('Show Front');
      console.log('Current state - showing back:', isShowingBack);

      // Ensure we start with front side
      if (isShowingBack) {
        console.log('Switching to front side');
        flipButton.click();
        await waitForDOM(2000);
      }

      // Capture front side
      console.log('Capturing front side');
      await waitForDOM(1000);
      
      const frontCanvas = await html2canvas(cardElement, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        width: 400,
        height: 250
      });

      if (frontCanvas.width === 0 || frontCanvas.height === 0) {
        console.error('Front canvas is empty');
        restoreButtons(buttons);
        return false;
      }

      // Add front side to PDF
      const frontImgData = frontCanvas.toDataURL('image/png', 1.0);
      
      // Add title and guidelines
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text('ID CARD - FRONT SIDE', pageWidth / 2, 30, { align: 'center' });
      
      // Add cutting guidelines
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.1);
      pdf.rect(cardX - 2, frontY - 2, cardWidth + 4, cardHeight + 4);
      
      pdf.addImage(frontImgData, 'PNG', cardX, frontY, cardWidth, cardHeight);
      
      // Add cutting instructions
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Cut along dotted lines', cardX, frontY - 5);

      // Switch to back side
      console.log('Switching to back side');
      flipButton.click();
      await waitForDOM(2000);

      // Capture back side
      console.log('Capturing back side');
      await waitForDOM(1000);
      
      const backCanvas = await html2canvas(cardElement, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        width: 400,
        height: 250
      });

      if (backCanvas.width === 0 || backCanvas.height === 0) {
        console.error('Back canvas is empty');
        restoreButtons(buttons);
        return false;
      }

      // Add back side to PDF
      const backImgData = backCanvas.toDataURL('image/png', 1.0);
      
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text('ID CARD - BACK SIDE', pageWidth / 2, backY - 25, { align: 'center' });
      
      // Add cutting guidelines for back
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.1);
      pdf.rect(cardX - 2, backY - 2, cardWidth + 4, cardHeight + 4);
      
      pdf.addImage(backImgData, 'PNG', cardX, backY, cardWidth, cardHeight);
      
      // Add cutting instructions for back
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Cut along dotted lines', cardX, backY - 5);

      // Add printing instructions at bottom
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text('PRINTING INSTRUCTIONS:', 20, pageHeight - 40);
      pdf.setFontSize(8);
      pdf.text('1. Print this page on A4 paper (preferably cardstock)', 20, pageHeight - 30);
      pdf.text('2. Cut along the dotted lines around each card', 20, pageHeight - 25);
      pdf.text('3. Place cut cards in plastic card sleeves for protection', 20, pageHeight - 20);
      pdf.text('4. Standard credit card size: 85.6mm x 54mm', 20, pageHeight - 15);

      // Restore original state if needed
      if (!isShowingBack) {
        console.log('Restoring to front side');
        flipButton.click();
        await waitForDOM(1000);
      }
    } else {
      // Single side capture
      const canvas = await html2canvas(cardElement, {
        scale: 3,
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

      const imgData = canvas.toDataURL('image/png', 1.0);
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
      const flipButton = findFlipButton(containerElement);

      if (!flipButton) {
        console.error('Flip button not found');
        restoreButtons(buttons);
        return false;
      }

      // Create combined canvas for A4 printable format
      const combinedCanvas = document.createElement('canvas');
      const ctx = combinedCanvas.getContext('2d');
      if (!ctx) {
        console.error('Canvas context not available');
        restoreButtons(buttons);
        return false;
      }

      const scale = 3;
      const cardPixelWidth = 400 * scale;
      const cardPixelHeight = 250 * scale;
      
      // A4 proportions in pixels (2480 x 3508 at 300 DPI)
      combinedCanvas.width = 2480;
      combinedCanvas.height = 3508;

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);

      // Calculate positions for cards centered on A4
      const centerX = (combinedCanvas.width - cardPixelWidth) / 2;
      const frontY = 600;
      const backY = frontY + cardPixelHeight + 400;

      // Get current state
      const isShowingBack = flipButton.textContent?.includes('Show Front');

      // Ensure front side first
      if (isShowingBack) {
        flipButton.click();
        await waitForDOM(2000);
      }

      // Capture front
      await waitForDOM(1000);
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

      // Draw front side with labels and guidelines
      ctx.fillStyle = '#000000';
      ctx.font = `bold ${48 * scale}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText('ID CARD - FRONT SIDE', combinedCanvas.width / 2, frontY - 100);
      
      // Draw cutting guidelines for front
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.strokeRect(centerX - 20, frontY - 20, cardPixelWidth + 40, cardPixelHeight + 40);
      ctx.setLineDash([]);
      
      ctx.drawImage(frontCanvas, centerX, frontY);

      // Switch to back
      flipButton.click();
      await waitForDOM(2000);

      // Capture back
      await waitForDOM(1000);
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

      // Draw back side with labels and guidelines
      ctx.fillText('ID CARD - BACK SIDE', combinedCanvas.width / 2, backY - 100);
      
      // Draw cutting guidelines for back
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.strokeRect(centerX - 20, backY - 20, cardPixelWidth + 40, cardPixelHeight + 40);
      ctx.setLineDash([]);
      
      ctx.drawImage(backCanvas, centerX, backY);

      // Add instructions at bottom
      ctx.font = `${24 * scale}px Arial`;
      ctx.textAlign = 'left';
      ctx.fillText('PRINTING INSTRUCTIONS:', 100, combinedCanvas.height - 300);
      ctx.font = `${20 * scale}px Arial`;
      ctx.fillText('1. Print on A4 paper (preferably cardstock)', 100, combinedCanvas.height - 250);
      ctx.fillText('2. Cut along dotted lines', 100, combinedCanvas.height - 220);
      ctx.fillText('3. Use plastic card sleeves for protection', 100, combinedCanvas.height - 190);
      ctx.fillText('4. Standard size: 85.6mm x 54mm', 100, combinedCanvas.height - 160);

      // Restore original state
      if (!isShowingBack) {
        flipButton.click();
        await waitForDOM(1000);
      }

      // Download
      const link = document.createElement('a');
      link.download = `${fileName}-A4-printable.png`;
      link.href = combinedCanvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Single side
      const canvas = await html2canvas(cardElement, {
        scale: 3,
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
          <div class="print-header">
            <h1>ID CARD PRINTOUT - READY FOR CUTTING</h1>
            <p>Print on A4 paper, cut along dotted lines, insert in plastic card sleeve</p>
          </div>
          
          <div class="card-section">
            <h2 class="card-title">FRONT SIDE</h2>
            <div class="card-wrapper">
              <div class="cutting-guide"></div>
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
          
          <div class="card-section">
            <h2 class="card-title">BACK SIDE</h2>
            <div class="card-wrapper">
              <div class="cutting-guide"></div>
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
          
          <div class="instructions">
            <h3>CUTTING AND ASSEMBLY INSTRUCTIONS</h3>
            <ol>
              <li>Print this page on A4 cardstock paper (recommended weight: 200-300gsm)</li>
              <li>Cut carefully along the dotted lines around each card</li>
              <li>Ensure clean, straight cuts for professional appearance</li>
              <li>Insert cut cards into plastic card sleeves (CR80 size: 85.6mm × 54mm)</li>
              <li>Cards are now ready for professional use</li>
            </ol>
          </div>
        </div>
      `;
    } else {
      printContent = `
        <div class="print-container">
          <div class="print-header">
            <h1>ID CARD PRINTOUT</h1>
          </div>
          <div class="card-section">
            <div class="card-wrapper">
              <div class="cutting-guide"></div>
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
        </div>
      `;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>ID Card Print - A4 Ready</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: system-ui, -apple-system, sans-serif;
              background: white;
              padding: 20mm;
              color: #333;
              line-height: 1.4;
            }
            
            .print-container {
              max-width: 170mm;
              margin: 0 auto;
            }
            
            .print-header {
              text-align: center;
              margin-bottom: 20mm;
              padding-bottom: 10mm;
              border-bottom: 2px solid #333;
            }
            
            .print-header h1 {
              font-size: 18pt;
              font-weight: bold;
              margin-bottom: 5mm;
              color: #000;
            }
            
            .print-header p {
              font-size: 10pt;
              color: #666;
            }
            
            .card-section {
              margin-bottom: 25mm;
              page-break-inside: avoid;
            }
            
            .card-title {
              font-size: 14pt;
              font-weight: bold;
              text-align: center;
              margin-bottom: 10mm;
              color: #000;
            }
            
            .card-wrapper {
              position: relative;
              display: flex;
              justify-content: center;
              margin: 15mm 0;
            }
            
            .cutting-guide {
              position: absolute;
              width: 89.6mm;
              height: 58mm;
              border: 2px dashed #999;
              border-radius: 3mm;
              top: -2mm;
              left: 50%;
              transform: translateX(-50%);
              z-index: 1;
            }
            
            .cutting-guide::before {
              content: "✂ Cut along this line";
              position: absolute;
              top: -8mm;
              left: 50%;
              transform: translateX(-50%);
              font-size: 8pt;
              color: #666;
              background: white;
              padding: 0 2mm;
            }
            
            .id-card {
              width: 85.6mm;
              height: 54mm;
              background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%);
              border-radius: 4mm;
              padding: 3mm;
              color: white;
              position: relative;
              overflow: hidden;
              box-shadow: 0 2mm 8mm rgba(0, 0, 0, 0.3);
              border: 1px solid #1e40af;
              z-index: 2;
            }
            
            .security-badges {
              position: absolute;
              top: 1.5mm;
              left: 1.5mm;
              right: 1.5mm;
              display: flex;
              justify-content: space-between;
              z-index: 10;
            }
            
            .badge {
              padding: 0.5mm 1.5mm;
              border-radius: 2mm;
              font-size: 6pt;
              font-weight: bold;
              color: white;
            }
            
            .secure, .official { background: rgba(16, 185, 129, 0.9); }
            .verified, .authentic { background: rgba(59, 130, 246, 0.9); }
            
            .card-header {
              text-align: center;
              margin: 6mm 0 4mm 0;
            }
            
            .card-header h3 {
              font-size: 10pt;
              font-weight: bold;
              letter-spacing: 1pt;
              margin-bottom: 1mm;
            }
            
            .card-header h4 {
              font-size: 7pt;
              font-weight: bold;
              margin-bottom: 0.5mm;
              line-height: 1.2;
            }
            
            .gradient-line {
              width: 12mm;
              height: 0.5mm;
              background: linear-gradient(to right, #60a5fa, #34d399);
              margin: 0 auto;
              border-radius: 0.25mm;
            }
            
            .card-content {
              display: flex;
              align-items: center;
              gap: 3mm;
              height: 18mm;
            }
            
            .card-content-back {
              display: flex;
              gap: 3mm;
              height: 25mm;
            }
            
            .avatar {
              width: 15mm;
              height: 15mm;
              border: 0.5mm solid rgba(255, 255, 255, 0.8);
              border-radius: 50%;
              background: linear-gradient(135deg, #ffffff, #f1f5f9);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #0f172a;
              font-weight: bold;
              font-size: 12pt;
              flex-shrink: 0;
              box-shadow: 0 1mm 3mm rgba(0, 0, 0, 0.3);
            }
            
            .info {
              flex: 1;
            }
            
            .info h4 {
              font-size: 9pt;
              font-weight: bold;
              margin-bottom: 1mm;
              letter-spacing: 0.25mm;
            }
            
            .details {
              margin-bottom: 2mm;
            }
            
            .details div {
              margin: 0.5mm 0;
              font-size: 7pt;
              display: flex;
              align-items: center;
              gap: 1mm;
            }
            
            .label {
              color: #bfdbfe;
              font-weight: 600;
              min-width: 6mm;
            }
            
            .value {
              font-family: 'Courier New', monospace;
              font-weight: 500;
              font-size: 6pt;
            }
            
            .status-badges {
              display: flex;
              gap: 1mm;
            }
            
            .status-badge {
              padding: 0.5mm 1mm;
              border-radius: 1mm;
              font-size: 5pt;
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
              gap: 1mm;
              flex-shrink: 0;
            }
            
            .qr-section-large {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 1mm;
              flex-shrink: 0;
            }
            
            .qr-code {
              width: 10mm;
              height: 10mm;
              background: white;
              color: #000;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 1mm;
              font-weight: bold;
              font-size: 6pt;
              box-shadow: 0 1mm 2mm rgba(0, 0, 0, 0.2);
            }
            
            .qr-code-large {
              width: 12mm;
              height: 12mm;
              background: white;
              color: #000;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 1mm;
              font-weight: bold;
              font-size: 7pt;
              box-shadow: 0 1mm 2mm rgba(0, 0, 0, 0.2);
            }
            
            .qr-label {
              font-size: 5pt;
              font-weight: bold;
              color: #bfdbfe;
            }
            
            .verify-info {
              text-align: center;
            }
            
            .verify-title {
              font-size: 5pt;
              font-weight: bold;
              color: #bfdbfe;
              margin-bottom: 0.5mm;
            }
            
            .auth-text {
              font-size: 4pt;
              color: #93c5fd;
            }
            
            .info-section {
              flex: 1;
              display: flex;
              flex-direction: column;
              gap: 2mm;
            }
            
            .info-box {
              background: rgba(255, 255, 255, 0.15);
              border-radius: 1.5mm;
              padding: 2mm;
              backdrop-filter: blur(1mm);
              border: 0.25mm solid rgba(255, 255, 255, 0.2);
            }
            
            .info-box h5 {
              font-size: 5pt;
              font-weight: bold;
              margin-bottom: 1mm;
              color: #bfdbfe;
              letter-spacing: 0.25mm;
            }
            
            .guide-list div, .card-details div {
              font-size: 4pt;
              margin: 0.5mm 0;
              line-height: 1.3;
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
              bottom: 1.5mm;
              left: 3mm;
              right: 3mm;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 5pt;
              color: rgba(191, 219, 254, 0.9);
              border-top: 0.25mm solid rgba(255, 255, 255, 0.2);
              padding-top: 1mm;
              font-family: 'Courier New', monospace;
            }
            
            .secure-indicator {
              display: flex;
              align-items: center;
              gap: 0.5mm;
              font-size: 5pt;
              font-weight: bold;
            }
            
            .instructions {
              margin-top: 20mm;
              padding: 10mm;
              background: #f8f9fa;
              border-radius: 3mm;
              border: 1px solid #dee2e6;
              page-break-inside: avoid;
            }
            
            .instructions h3 {
              font-size: 12pt;
              font-weight: bold;
              margin-bottom: 5mm;
              color: #000;
              text-align: center;
            }
            
            .instructions ol {
              list-style: decimal;
              padding-left: 8mm;
            }
            
            .instructions li {
              font-size: 10pt;
              margin-bottom: 2mm;
              line-height: 1.4;
              color: #333;
            }
            
            @media print {
              body { 
                margin: 0; 
                padding: 10mm; 
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              .print-container { 
                max-width: none;
              }
              
              .card-section {
                page-break-inside: avoid;
              }
              
              .instructions {
                page-break-before: auto;
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
