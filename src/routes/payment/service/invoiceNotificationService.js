// services/invoiceNotificationService.js
const { sendWhatsAppMessage } = require("../../../config/whatsapp");
const { sendEMail } = require("../../../config/smtp");
const { generateAndUploadInvoice } = require("./invoiceGenerationService");
const db = require("../../../config/db");

/**
 * Send payment invoice notifications via WhatsApp and Email
 * @param {Object} transactionData - Complete transaction details
 * @param {Object} memberData - Member information
 * @param {Object} chapterData - Chapter information
 * @param {Object} chapterConfig - Chapter configuration for notifications
 */
const sendPaymentInvoiceNotifications = async (transactionData, memberData, chapterData, chapterConfig) => {
  const results = {
    whatsapp: { sent: false, error: null },
    email: { sent: false, error: null },
    invoiceGenerated: false,
    invoiceUrl: null
  };

  try {
    // Generate invoice PDF and upload to S3
    const invoiceUrl = await generateAndUploadInvoice(transactionData, memberData, chapterData,chapterConfig);
    results.invoiceGenerated = true;
    results.invoiceUrl = invoiceUrl;

    // Prepare notification data
    const notificationData = {
      memberName: `${memberData.firstName} ${memberData.lastName}`,
      chapterName: chapterData.chapterName,
      amount: transactionData.paidAmount,
      transactionId: transactionData.transactionId,
      paymentDate: new Date(transactionData.paymentDate).toLocaleDateString('en-IN'),
      invoiceUrl: invoiceUrl,
      invoiceFilename: `Invoice_${transactionData.transactionId}.pdf`
    };

    // Send WhatsApp notification if enabled
    if (chapterConfig.sendTransactionUpdatesWAMsg && memberData.phoneNumber) {
      try {
        // Prepare WhatsApp template data
        const whatsappTemplateData = {
          templateName: "payment_invoice", // Register this template name with Dovesoft
          languageCode: "en",
          components: [
            {
              type: "header",
              parameters: [
                {
                  type: "document",
                  document: {
                    link: invoiceUrl,
                    filename: notificationData.invoiceFilename
                  }
                }
              ]
            },
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: notificationData.memberName
                },
                {
                  type: "text", 
                  text: notificationData.chapterName
                },
                {
                  type: "text",
                  text: notificationData.amount.toString()
                },
                {
                  type: "text",
                  text: notificationData.transactionId
                },
                {
                  type: "text",
                  text: notificationData.paymentDate
                }
              ]
            }
          ]
        };

        const whatsappResult = await sendWhatsAppMessage(
          "utility",
          memberData.phoneNumber,
          whatsappTemplateData
        );
        
        results.whatsapp.sent = whatsappResult.ok;
        if (!whatsappResult.ok) {
          results.whatsapp.error = whatsappResult.message;
        }
      } catch (error) {
        results.whatsapp.error = error.message;
        console.error("WhatsApp notification error:", error);
      }
    }

    // Send Email notification if enabled
    if (chapterConfig.sendTransactionUpdatesEmail && memberData.email) {
      try {
        const emailOptions = {
          to: memberData.email,
          subject: `Payment Confirmation - ${notificationData.chapterName}`,
          html: generateInvoiceEmailHTML(notificationData),
          attachments: [
            {
              filename: notificationData.invoiceFilename,
              path: invoiceUrl,
              contentType: 'application/pdf'
            }
          ]
        };

        await sendEMail(emailOptions);
        results.email.sent = true;
      } catch (error) {
        results.email.error = error.message;
        console.error("Email notification error:", error);
      }
    }

  } catch (error) {
    results.error = error.message;
    console.error("Invoice generation error:", error);
  }

  return results;
};

/**
 * Generate HTML content for invoice email
 * @param {Object} data - Notification data
 * @returns {string} HTML content
 */
const generateInvoiceEmailHTML = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Confirmation</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
            .info-row { margin: 10px 0; padding: 10px; background-color: white; border-radius: 3px; }
            .label { font-weight: bold; color: #555; }
            .value { color: #333; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            .success { color: #4CAF50; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Payment Confirmation</h1>
                <p class="success">✓ Payment Successfully Processed</p>
            </div>
            <div class="content">
                <p>Dear ${data.memberName},</p>
                <p>We are pleased to confirm that your payment has been successfully processed. Here are the details:</p>
                
                <div class="info-row">
                    <span class="label">Chapter:</span>
                    <span class="value">${data.chapterName}</span>
                </div>
                <div class="info-row">
                    <span class="label">Amount Paid:</span>
                    <span class="value">${data.amount}</span>
                </div>
                <div class="info-row">
                    <span class="label">Transaction ID:</span>
                    <span class="value">${data.transactionId}</span>
                </div>
                <div class="info-row">
                    <span class="label">Payment Date:</span>
                    <span class="value">${data.paymentDate}</span>
                </div>
                
                <p>Please find your payment invoice attached to this email for your records.</p>
                <p>If you have any questions regarding this payment, please don't hesitate to contact us.</p>
                
                <p>Thank you for your payment!</p>
                <p>Best regards,<br><strong>${data.chapterName}</strong></p>
            </div>
            <div class="footer">
                <p>This is an automated email. Please do not reply to this message.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

module.exports = {
  sendPaymentInvoiceNotifications
};
