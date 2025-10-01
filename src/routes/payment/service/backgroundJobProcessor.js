// services/backgroundJobProcessor.js
const { sendPaymentInvoiceNotifications } = require("./invoiceNotificationService");
const db = require("../../../config/db");

/**
 * Process invoice notifications in the background
 * @param {Array} transactionDetails - Array of transaction details
 */
const processInvoiceNotifications = async (transactionDetails) => {
  if (!transactionDetails || transactionDetails.length === 0) {
    return;
  }

  try {
    // Get chapter configuration
    const chapterConfig = await db('chapterConfig')
      .where('chapterId', transactionDetails[0]?.chapterId)
      .first();

    if (!chapterConfig || 
        (!chapterConfig.sendTransactionUpdatesWAMsg && !chapterConfig.sendTransactionUpdatesEmail)) {
      console.log('Invoice notifications disabled for this chapter');
      return;
    }

    // Get chapter details
    const chapterData = await db('chapters')
      .where('chapterId', transactionDetails[0]?.chapterId)
      .first();

    if (!chapterData) {
      console.error('Chapter not found');
      return;
    }

    // Process each transaction
    const notificationPromises = transactionDetails.map(async (transaction) => {
      try {
        // Get complete transaction details
        const fullTransactionData = await db('transactions')
          .where('transactionId', transaction.transactionId)
          .first();

        if (!fullTransactionData) {
          console.error(`Transaction ${transaction.transactionId} not found`);
          return { error: 'Transaction not found' };
        }

        // Get member details
        const memberData = await db('members')
          .where('memberId', transaction.memberId)
          .first();

        if (!memberData) {
          console.error(`Member ${transaction.memberId} not found`);
          return { error: 'Member not found' };
        }

        // Send notifications
        const result = await sendPaymentInvoiceNotifications(
          fullTransactionData,
          memberData,
          chapterData,
          chapterConfig
        );

        console.log(`Invoice notification result for ${transaction.transactionId}:`, result);
        return result;

      } catch (error) {
        console.error(`Error processing invoice notification for transaction ${transaction.transactionId}:`, error);
        return { error: error.message };
      }
    });

    // Wait for all notifications to complete
    const results = await Promise.allSettled(notificationPromises);
    console.log('All invoice notifications processed:', results);

  } catch (error) {
    console.error('Error in background invoice notification processing:', error);
  }
};

module.exports = {
  processInvoiceNotifications
};
