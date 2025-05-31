
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generateCardPDF = async (elementId: string, fileName: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Hide buttons and interactive elements during capture
    const buttons = element.querySelectorAll('button');
    buttons.forEach(btn => btn.style.display = 'none');

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      width: 400,
      height: 250
    });

    // Restore buttons
    buttons.forEach(btn => btn.style.display = '');

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85.6, 54] // Standard credit card size
    });

    pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 54);
    pdf.save(`${fileName}.pdf`);

    return true;
  } catch (error) {
    console.error('PDF generation failed:', error);
    return false;
  }
};

export const printCard = (elementId: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Could not open print window');
    }

    const cardHtml = element.outerHTML;
    
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
              justify-content: center;
              align-items: center;
              min-height: 80vh;
            }
            button {
              display: none !important;
            }
            @media print {
              body { margin: 0; padding: 0; }
              .print-container { min-height: auto; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${cardHtml}
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

    return true;
  } catch (error) {
    console.error('Print failed:', error);
    return false;
  }
};

export const downloadCardImage = async (elementId: string, fileName: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Hide buttons during capture
    const buttons = element.querySelectorAll('button');
    buttons.forEach(btn => btn.style.display = 'none');

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: null,
      width: 400,
      height: 250
    });

    // Restore buttons
    buttons.forEach(btn => btn.style.display = '');

    // Create download link
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    return true;
  } catch (error) {
    console.error('Image download failed:', error);
    return false;
  }
};
