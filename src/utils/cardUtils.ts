
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
      backgroundColor: '#ffffff',
      width: element.offsetWidth,
      height: element.offsetHeight
    });

    // Restore buttons
    buttons.forEach(btn => btn.style.display = '');

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4' // A4 format for easy cutting
    });

    // Calculate dimensions to fit A4 page
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgWidth = pageWidth - 20; // 10mm margin on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Center the image on the page
    const x = 10; // 10mm margin
    const y = (pageHeight - imgHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
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
          <title>ID Card Print - A4</title>
          <style>
            @page {
              size: A4;
              margin: 10mm;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: system-ui, -apple-system, sans-serif;
              background: white;
              color: black;
            }
            .print-container {
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: flex-start;
              padding-top: 20mm;
            }
            button {
              display: none !important;
            }
            @media print {
              body { 
                margin: 0; 
                padding: 0;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
              .print-container { 
                padding-top: 0;
                align-items: center;
              }
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
      backgroundColor: '#ffffff',
      width: element.offsetWidth,
      height: element.offsetHeight
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
