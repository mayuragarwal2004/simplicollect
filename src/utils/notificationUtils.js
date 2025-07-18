const notificationService = require('../notification/service/notificationService');

/**
 * Common notification utilities for sending notifications across the application
 */

/**
 * Send payment received notification to fee receiver
 * @param {string} receiverId - Member ID of the fee receiver
 * @param {Object} paymentData - Payment details
 * @param {string} senderName - Name of the person who made the payment
 * @param {string} chapterName - Name of the chapter
 */
const sendPaymentReceivedNotification = async (receiverId, paymentData, senderName, chapterName) => {
  try {
    if (!receiverId) {
      console.log('No receiver ID provided, skipping notification');
      return;
    }

    const notificationData = {
      title: 'New Payment Received',
      message: `${senderName} has submitted a payment of ₹${paymentData.paidAmount} in ${chapterName}. Please review and approve.`,
      type: 'payment',
      priority: 'high',
      isPersistent: true,
      recipientId: receiverId,
      chapterId: paymentData.chapterId,
      relatedEntityType: 'payment',
      relatedEntityId: paymentData.transactionId,
      // Add click action data for navigation
      clickAction: '/member/fee-approval',
      customData: {
        route: '/member/fee-approval',
        transactionId: paymentData.transactionId,
        chapterId: paymentData.chapterId,
        action: 'review_payment'
      }
    };

    const result = await notificationService.sendNotification(notificationData);
    console.log(`Payment notification sent to receiver ${receiverId}:`, result.notificationId);
    return result;
  } catch (error) {
    console.error('Error sending payment received notification:', error);
    // Don't throw error as this shouldn't fail the payment process
  }
};

/**
 * Send payment approval notification to member
 * @param {string} memberId - Member ID who made the payment
 * @param {Object} paymentData - Payment details
 * @param {string} approverName - Name of the person who approved
 * @param {string} chapterName - Name of the chapter
 */
const sendPaymentApprovedNotification = async (memberId, paymentData, approverName, chapterName) => {
  try {
    const notificationData = {
      title: 'Payment Approved',
      message: `Your payment of ₹${paymentData.paidAmount} in ${chapterName} has been approved by ${approverName}.`,
      type: 'payment',
      priority: 'medium',
      isPersistent: true,
      recipientId: memberId,
      chapterId: paymentData.chapterId,
      relatedEntityType: 'payment',
      relatedEntityId: paymentData.transactionId,
      // Add click action data for navigation
      clickAction: '/member/fee',
      customData: {
        route: '/member/fee',
        transactionId: paymentData.transactionId,
        chapterId: paymentData.chapterId,
        action: 'view_payment_status'
      }
    };

    const result = await notificationService.sendNotification(notificationData);
    console.log(`Payment approval notification sent to member ${memberId}:`, result.notificationId);
    return result;
  } catch (error) {
    console.error('Error sending payment approval notification:', error);
    // Don't throw error as this shouldn't fail the approval process
  }
};

/**
 * Send meeting reminder notification
 * @param {string} memberId - Member ID to notify
 * @param {Object} meetingData - Meeting details
 * @param {string} chapterName - Name of the chapter
 */
const sendMeetingReminderNotification = async (memberId, meetingData, chapterName) => {
  try {
    const notificationData = {
      title: 'Meeting Reminder',
      message: `Reminder: ${meetingData.title} meeting in ${chapterName} is scheduled for ${new Date(meetingData.datetime).toLocaleString()}.`,
      type: 'meeting',
      priority: 'medium',
      isPersistent: true,
      recipientId: memberId,
      chapterId: meetingData.chapterId,
      relatedEntityType: 'meeting',
      relatedEntityId: meetingData.meetingId,
      // Add click action data for navigation
      clickAction: '/member/fee',
      customData: {
        route: '/member/fee',
        meetingId: meetingData.meetingId,
        chapterId: meetingData.chapterId,
        action: 'view_meeting_details'
      }
    };

    const result = await notificationService.sendNotification(notificationData);
    console.log(`Meeting reminder notification sent to member ${memberId}:`, result.notificationId);
    return result;
  } catch (error) {
    console.error('Error sending meeting reminder notification:', error);
  }
};

/**
 * Send chapter report notification
 * @param {string} memberId - Member ID to notify
 * @param {Object} reportData - Report details
 * @param {string} chapterName - Name of the chapter
 */
const sendChapterReportNotification = async (memberId, reportData, chapterName) => {
  try {
    const notificationData = {
      title: 'Chapter Report Available',
      message: `The ${reportData.reportType} report for ${chapterName} is now available for review.`,
      type: 'report',
      priority: 'medium',
      isPersistent: true,
      recipientId: memberId,
      chapterId: reportData.chapterId,
      relatedEntityType: 'report',
      relatedEntityId: reportData.reportId,
      // Add click action data for navigation
      clickAction: '/member/reports',
      customData: {
        route: '/member/reports',
        reportId: reportData.reportId,
        chapterId: reportData.chapterId,
        reportType: reportData.reportType,
        action: 'view_report'
      }
    };

    const result = await notificationService.sendNotification(notificationData);
    console.log(`Report notification sent to member ${memberId}:`, result.notificationId);
    return result;
  } catch (error) {
    console.error('Error sending chapter report notification:', error);
  }
};

/**
 * Send bulk notifications to multiple members
 * @param {Array} memberIds - Array of member IDs to notify
 * @param {Object} notificationData - Notification details
 */
const sendBulkNotification = async (memberIds, notificationData) => {
  try {
    const promises = memberIds.map(memberId => 
      notificationService.sendNotification({
        ...notificationData,
        recipientId: memberId,
        // Add default click action if not provided
        clickAction: notificationData.clickAction || '/member',
        customData: {
          ...notificationData.customData,
          route: notificationData.clickAction || '/member',
          action: notificationData.customData?.action || 'view_notification'
        }
      })
    );

    const results = await Promise.allSettled(promises);
    const successful = results.filter(result => result.status === 'fulfilled').length;
    console.log(`Bulk notification sent: ${successful}/${memberIds.length} successful`);
    
    return { total: memberIds.length, successful };
  } catch (error) {
    console.error('Error sending bulk notifications:', error);
  }
};

module.exports = {
  sendPaymentReceivedNotification,
  sendPaymentApprovedNotification,
  sendMeetingReminderNotification,
  sendChapterReportNotification,
  sendBulkNotification
};
