// services/invoiceGenerationService.js
const PDFDocument = require('pdfkit');
const { uploadToS3 } = require('../../../config/aws');
const db = require('../../../config/db');

/**
 * Generate invoice PDF and upload to S3
 * @param {Object} transactionData - Transaction details
 * @param {Object} memberData - Member details
 * @param {Object} chapterData - Chapter details
 * @returns {Promise<string>} S3 URL of the generated invoice
 */
const generateAndUploadInvoice = async (transactionData, memberData, chapterData,chapterConfig) => {
  try {

   const pdfBuffer = await generateInvoicePDF(transactionData, memberData, chapterData, chapterConfig);
    // Upload to S3
    const fileName = `invoices/${chapterData.chapterSlug}/${transactionData.transactionId}.pdf`;
    console.log("filename is",fileName)
    const uploadResult = await uploadToS3(fileName, pdfBuffer);
    
    console.log("uploadResult", uploadResult)
    
    if (uploadResult.success) {
      return uploadResult.imageUrl;
    } else {
      throw new Error(uploadResult.error);
    }
  } catch (error) {
    console.error('Error generating invoice:', error);
    throw error;
  }
};

/**
 * Generate PDF content for invoice
 */
const puppeteer = require('puppeteer');
const Handlebars = require('handlebars');

const generateInvoicePDF = async (transactionData, memberData, chapterData, chapterConfig) => {
  try {
    // Prepare dynamic data for the template
    const paymentDate = new Date(transactionData.paymentDate);
    transactionData.paymentDate = `${paymentDate.getDate().toString().padStart(2, '0')}/${
      (paymentDate.getMonth() + 1).toString().padStart(2, '0')
    }/${paymentDate.getFullYear()}`;
    const context = {
      transactionData,
      memberData,
      chapterData,
      chapterConfig,
      currentDate: new Date().toLocaleString('en-IN')
    };

    // Compile the Handlebars HTML template
    const template = Handlebars.compile(chapterConfig.invoiceHTMLTemplate);
    const renderedHTML = template(context);

    // Launch Puppeteer and generate the PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(renderedHTML, { waitUntil: 'domcontentloaded' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' }
    });

    await browser.close();

    // Return the generated PDF as a buffer
    return pdfBuffer;

  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    throw error;
  }
};



module.exports = {
  generateAndUploadInvoice
};
