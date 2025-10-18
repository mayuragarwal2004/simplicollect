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
    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });
    
    // Create buffer to store PDF
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    
    // Generate PDF content
    await generateInvoicePDF(doc, transactionData, memberData, chapterData, chapterConfig);
    
    // End the document
    doc.end();
    
    // Wait for PDF generation to complete
    const pdfBuffer = await new Promise((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
    });
    
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
const generateInvoicePDF = async (doc, transactionData, memberData, chapterData, chapterConfig) => {
  // Colors
  
  const primaryColor = '#2563eb';
  const secondaryColor = '#64748b';
  const successColor = '#059669';
  
  // Header
  doc.fillColor(primaryColor)
     .fontSize(28)
     .text('PAYMENT INVOICE', 50, 50);
  
  doc.fillColor(successColor)
     .fontSize(14)
     .text('✓ PAYMENT CONFIRMED', 450, 60);
  
  // Invoice details box
  doc.rect(50, 100, 500, 80)
     .strokeColor('#e5e7eb')
     .stroke();
     console.log("this is:",chapterConfig)
  doc.fillColor('#000')
     .fontSize(12)
     .text(`Invoice #: ${chapterConfig.invoicePrefix} ${chapterConfig.invoiceCount}`, 60, 115)
     .text(`Date: ${new Date(transactionData.paymentDate).toLocaleDateString('en-IN')}`, 60, 135)
     .text(`Chapter: ${chapterData.chapterName}`, 300, 115)
     .text(`Status: PAID`, 300, 135);
  
  // Member details
  doc.fontSize(16)
     .fillColor(primaryColor)
     .text('BILLED TO:', 50, 200);
  
  doc.fillColor('#000')
     .fontSize(12)
     .text(`${memberData.firstName} ${memberData.lastName}`, 50, 225)
     .text(`Email: ${memberData.email || 'N/A'}`, 50, 245)
     .text(`Phone: ${memberData.phoneNumber || 'N/A'}`, 50, 265)
     .text(`GSTIN: ${memberData.gstin || 'N/A'}`, 50, 285)
     .text(`Address: ${memberData.address || 'N/A'}`, 50, 305);
  // Payment details table
  const tableTop = 355;
  doc.fontSize(16)
     .fillColor(primaryColor)
     .text('PAYMENT DETAILS:', 50, tableTop - 25);
  
  // Table header
  doc.rect(50, tableTop, 500, 30)
     .fillColor('#f8fafc')
     .fillAndStroke('#e5e7eb', '#e5e7eb');
  
  doc.fillColor('#000')
     .fontSize(12)
     .text('Description', 60, tableTop + 10)
     .text('Amount', 450, tableTop + 10);
  
  // Table rows
  let yPosition = tableTop + 30;
  
  // Original amount
  if (transactionData.originalPayableAmount > 0) {
    doc.rect(50, yPosition, 500, 25)
       .strokeColor('#e5e7eb')
       .stroke();
    doc.text('Original Payable Amount', 60, yPosition + 8)
       .text(`₹${transactionData.originalPayableAmount}`, 450, yPosition + 8);
    yPosition += 25;
  }
  
  // Discount
  if (transactionData.discountAmount > 0) {
    doc.rect(50, yPosition, 500, 25)
       .strokeColor('#e5e7eb')
       .stroke();
    doc.fillColor(successColor)
       .text('Discount Applied', 60, yPosition + 8)
       .text(`-₹${transactionData.discountAmount}`, 450, yPosition + 8);
    doc.fillColor('#000');
    yPosition += 25;
  }
  
  // Penalty
  if (transactionData.penaltyAmount > 0) {
    doc.rect(50, yPosition, 500, 25)
       .strokeColor('#e5e7eb')
       .stroke();
    doc.fillColor('#dc2626')
       .text('Penalty', 60, yPosition + 8)
       .text(`₹${transactionData.penaltyAmount}`, 450, yPosition + 8);
    doc.fillColor('#000');
    yPosition += 25;
  }
  
  // Platform fee
  if (transactionData.platformFee > 0) {
    doc.rect(50, yPosition, 500, 25)
       .strokeColor('#e5e7eb')
       .stroke();
    doc.text('Platform Fee', 60, yPosition + 8)
       .text(`₹${transactionData.platformFee}`, 450, yPosition + 8);
    yPosition += 25;
  }
  
  // Total paid
  doc.rect(50, yPosition, 500, 30)
     .fillColor(primaryColor)
     .fillAndStroke(primaryColor, primaryColor);
  
  doc.fillColor('#fff')
     .fontSize(14)
     .text('TOTAL PAID', 60, yPosition + 10)
     .text(`₹${transactionData.paidAmount}`, 450, yPosition + 10);
  
  // Payment method and receiver info
  yPosition += 60;
  doc.fillColor(primaryColor)
     .fontSize(16)
     .text('PAYMENT INFORMATION:', 50, yPosition);
  
  doc.fillColor('#000')
     .fontSize(12)
     .text(`Payment Type: ${transactionData.paymentType || 'N/A'}`, 50, yPosition + 25);
  
  if (transactionData.paymentReceivedByName) {
    doc.text(`Received By: ${transactionData.paymentReceivedByName}`, 50, yPosition + 45);
  }
  
  // Footer
  doc.fontSize(10)
     .fillColor(secondaryColor)
     .text('This is a computer generated invoice. No signature required.', 50, 700, {
       align: 'center',
       width: 500
     })
     .text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 50, 720, {
       align: 'center',
       width: 500
     });
  
  // Add chapter logo if available (optional)
  // if (chapterData.logoUrl) {
  //   doc.image(chapterData.logoUrl, 450, 50, { width: 80 });
  // }
};

module.exports = {
  generateAndUploadInvoice
};
