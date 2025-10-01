const notificationModel = require('../model/notificationModel');
const webpush = require('web-push');
const fcmService = require('../../../config/fcmService');
const db = require('../../../config/db');
const { v4: uuidv4 } = require('uuid');

// Configure web-push (for backward compatibility)
webpush.setVapidDetails(
  'mailto:' + (process.env.VAPID_EMAIL || 'admin@simplicollect.com'),
  process.env.VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

// Send a single notification
const sendNotification = async (notificationData) => {
  try {
    // Create notification in database
    const notification = await notificationModel.createNotification(notificationData);
    
    // Send push notification if not scheduled
    if (!notificationData.scheduledAt) {
      await sendPushNotification(notificationData.recipientId, {
        title: notificationData.title,
        body: notificationData.message,
        type: notificationData.type,
        notificationId: notification.notificationId,
        priority: notificationData.priority,
        clickAction: notificationData.clickAction,
        customData: notificationData.customData
      });
    }

    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

// Send bulk notifications
const sendBulkNotifications = async (notificationData, targetType, targetData) => {
  try {
    // Get recipients based on target criteria
    const recipients = await notificationModel.getMembersByTarget(targetType, targetData);
    
    if (recipients.length === 0) {
      throw new Error('No recipients found for the specified criteria');
    }

    // Create bulk notifications in database
    const result = await notificationModel.createBulkNotifications(notificationData, recipients);

    // Send push notifications if not scheduled
    if (!notificationData.scheduledAt) {
      const pushPromises = recipients.map(recipient => 
        sendPushNotification(recipient.memberId, {
          title: notificationData.title,
          body: notificationData.message,
          type: notificationData.type,
          priority: notificationData.priority,
          clickAction: notificationData.clickAction,
          customData: notificationData.customData
        }).catch(error => {
          console.error(`Failed to send push notification to ${recipient.memberId}:`, error);
          return null;
        })
      );

      await Promise.allSettled(pushPromises);
    }

    return {
      success: true,
      totalSent: result.count,
      recipients: recipients.map(r => ({ 
        memberId: r.memberId, 
        name: `${r.firstName} ${r.lastName}`,
        email: r.email,
        phoneNumber: r.phoneNumber
      }))
    };
  } catch (error) {
    console.error('Error sending bulk notifications:', error);
    throw error;
  }
};

// Send push notification to a specific user
const sendPushNotification = async (memberId, payload) => {
  try {
    // Get user's push subscriptions (both FCM tokens and Web Push subscriptions)
    const subscriptions = await getPushSubscriptions(memberId);
    const fcmTokens = await getFCMTokens(memberId);
    
    const promises = [];
    
    // Send FCM notifications
    if (fcmTokens.length > 0) {
      try {
        const fcmPromise = fcmService.sendToMultipleTokens(fcmTokens, {
          title: payload.title,
          message: payload.body,
          type: payload.type,
          priority: payload.priority || 'medium',
          notificationId: payload.notificationId,
          clickAction: payload.clickAction,
          customData: payload.customData || {}
        });
        promises.push(fcmPromise);
      } catch (error) {
        console.error('Error sending FCM notification:', error);
      }
    }
    
    // Send Web Push notifications (for backward compatibility)
    const webPushPromises = subscriptions.map(async (subscription) => {
      try {
        const pushPayload = JSON.stringify({
          title: payload.title,
          body: payload.body,
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
          tag: payload.type || 'general',
          clickAction: payload.clickAction,
          customData: payload.customData,
          data: {
            notificationId: payload.notificationId,
            type: payload.type,
            clickAction: payload.clickAction,
            customData: payload.customData,
            // Legacy URL field for backward compatibility
            url: payload.clickAction || getNotificationUrl(payload.type)
          }
        });

        await webpush.sendNotification({
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth
          }
        }, pushPayload);

      } catch (error) {
        // If subscription is invalid, remove it
        if (error.statusCode === 410 || error.statusCode === 404) {
          await removePushSubscription(subscription.subscriptionId);
        }
        throw error;
      }
    });

    await Promise.allSettled(webPushPromises);
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};

// Get notification URL based on type
const getNotificationUrl = (type) => {
  const urlMap = {
    payment: '/member/fee',
    report: '/member/reports',
    meeting: '/member/meetings',
    profile: '/member/profile'
  };
  return urlMap[type] || '/';
};

// Get push subscriptions for a user
const getPushSubscriptions = async (memberId) => {
  const subscriptions = await db('push_subscriptions')
    .select('subscriptionId', 'endpoint', 'p256dh', 'auth')
    .where({ memberId, isActive: 1 });
  
  return subscriptions;
};

// Save push subscription
const savePushSubscription = async (memberId, subscription, userAgent = null) => {
  const subscriptionId = uuidv4();
  
  const subscriptionRecord = {
    subscriptionId,
    memberId,
    endpoint: subscription.endpoint,
    p256dh: subscription.keys.p256dh,
    auth: subscription.keys.auth,
    userAgent
  };

  try {
    await db('push_subscriptions').insert(subscriptionRecord);
  } catch (error) {
    // If duplicate, update existing record
    if (error.code === 'ER_DUP_ENTRY') {
      await db('push_subscriptions')
        .where({ memberId, endpoint: subscription.endpoint })
        .update({
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          userAgent,
          isActive: 1,
          updatedAt: new Date()
        });
    } else {
      throw error;
    }
  }

  return { subscriptionId, success: true };
};

// Remove push subscription
const removePushSubscription = async (subscriptionId) => {
  const result = await db('push_subscriptions')
    .where({ subscriptionId })
    .update({ isActive: 0 });
  
  return result > 0;
};

// Get FCM tokens for a user
const getFCMTokens = async (memberId) => {
  try {
    const result = await db('fcm_tokens')
      .where('memberId', memberId)
      .where('isActive', true)
      .select('token');
    
    return result.map(row => row.token);
  } catch (error) {
    console.error('Error getting FCM tokens:', error);
    return [];
  }
};

// Store FCM token
const storeFCMToken = async (memberId, token, platform = 'web') => {
  try {
    // Check if token already exists
    const existing = await db('fcm_tokens')
      .where('memberId', memberId)
      .where('token', token)
      .first();

    if (existing) {
      // Update existing token
      await db('fcm_tokens')
        .where('id', existing.id)
        .update({
          platform,
          isActive: true,
          updatedAt: new Date()
        });
    } else {
      // Insert new token
      await db('fcm_tokens').insert({
        memberId,
        token,
        platform,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return true;
  } catch (error) {
    console.error('Error storing FCM token:', error);
    throw error;
  }
};

// Remove FCM token
const removeFCMToken = async (memberId, token) => {
  try {
    await db('fcm_tokens')
      .where('memberId', memberId)
      .where('token', token)
      .update({ isActive: false });

    return true;
  } catch (error) {
    console.error('Error removing FCM token:', error);
    throw error;
  }
};

// Predefined notification types for common events
const sendPaymentRequestNotification = async (recipientId, paymentData) => {
  return sendNotification({
    title: 'New Payment Request',
    message: `You have received a payment request for ₹${paymentData.amount}. Please review and process.`,
    type: 'payment',
    priority: 'high',
    isPersistent: true,
    recipientId,
    relatedEntityType: 'payment',
    relatedEntityId: paymentData.paymentId
  });
};

const sendPaymentApprovalNotification = async (recipientId, paymentData) => {
  return sendNotification({
    title: 'Payment Approved',
    message: `Your payment of ₹${paymentData.amount} has been approved and processed.`,
    type: 'payment',
    priority: 'high',
    isPersistent: true,
    recipientId,
    relatedEntityType: 'payment',
    relatedEntityId: paymentData.paymentId
  });
};

const sendChapterReportNotification = async (recipientId, reportData) => {
  return sendNotification({
    title: 'Chapter Report Available',
    message: `The ${reportData.reportType} report for ${reportData.chapterName} is now available.`,
    type: 'report',
    priority: 'medium',
    isPersistent: true,
    recipientId,
    relatedEntityType: 'report',
    relatedEntityId: reportData.reportId
  });
};

// Not being used anywhere right now
const sendMeetingReminderNotification = async (recipientId, meetingData) => {
  return sendNotification({
    title: 'Meeting Reminder',
    message: `Don't forget about the ${meetingData.title} meeting scheduled for ${meetingData.datetime}.`,
    type: 'meeting',
    priority: 'medium',
    isPersistent: true,
    recipientId,
    relatedEntityType: 'meeting',
    relatedEntityId: meetingData.meetingId
  });
};

module.exports = {
  sendNotification,
  sendBulkNotifications,
  sendPushNotification,
  savePushSubscription,
  removePushSubscription,
  sendPaymentRequestNotification,
  sendPaymentApprovalNotification,
  sendChapterReportNotification,
  sendMeetingReminderNotification,
  storeFCMToken,
  removeFCMToken,
  getFCMTokens
};
