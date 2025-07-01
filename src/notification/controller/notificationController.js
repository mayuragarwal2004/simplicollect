const notificationModel = require('../model/notificationModel');
const notificationService = require('../service/notificationService');

// Get user's notifications
const getNotifications = async (req, res) => {
  try {
    const { memberId } = req.user;
    const { page = 0, limit = 20, unreadOnly = false, type } = req.query;
    
    const options = {
      limit: parseInt(limit),
      offset: parseInt(page) * parseInt(limit),
      unreadOnly: unreadOnly === 'true',
      type: type || null
    };

    const notifications = await notificationModel.getNotificationsByUser(memberId, options);
    const unreadCount = await notificationModel.getUnreadCount(memberId);

    res.json({
      success: true,
      notifications,
      unreadCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: notifications.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { memberId } = req.user;
    const { notificationId } = req.params;

    const success = await notificationModel.markAsRead(notificationId, memberId);
    
    if (success) {
      res.json({ success: true, message: 'Notification marked as read' });
    } else {
      res.status(404).json({ success: false, message: 'Notification not found' });
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, message: 'Failed to mark notification as read' });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const { memberId } = req.user;

    const count = await notificationModel.markAllAsRead(memberId);
    
    res.json({ 
      success: true, 
      message: `${count} notifications marked as read` 
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ success: false, message: 'Failed to mark notifications as read' });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { memberId } = req.user;
    const { notificationId } = req.params;

    const success = await notificationModel.deleteNotification(notificationId, memberId);
    
    if (success) {
      res.json({ success: true, message: 'Notification deleted' });
    } else {
      res.status(404).json({ success: false, message: 'Notification not found' });
    }
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ success: false, message: 'Failed to delete notification' });
  }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const { memberId } = req.user;
    const count = await notificationModel.getUnreadCount(memberId);
    
    res.json({ success: true, count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch unread count' });
  }
};

// Send single notification (Admin only)
const sendNotification = async (req, res) => {
  try {
    const { memberId } = req.user;
    const { title, message, type, priority, isPersistent, recipientId, chapterId } = req.body;

    if (!title || !message || !recipientId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, message, and recipientId are required' 
      });
    }

    const notificationData = {
      title,
      message,
      type: type || 'info',
      priority: priority || 'medium',
      isPersistent: isPersistent !== false,
      recipientId,
      senderId: memberId,
      chapterId: chapterId || null
    };

    const result = await notificationService.sendNotification(notificationData);
    
    res.json({ 
      success: true, 
      message: 'Notification sent successfully',
      notificationId: result.notificationId
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ success: false, message: 'Failed to send notification' });
  }
};

// Send bulk notifications (Admin only)
const sendBulkNotifications = async (req, res) => {
  try {
    const { memberId } = req.user;
    const { 
      title, 
      message, 
      type, 
      priority, 
      isPersistent, 
      targetType, 
      targetData 
    } = req.body;

    if (!title || !message || !targetType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, message, and targetType are required' 
      });
    }

    const notificationData = {
      title,
      message,
      type: type || 'info',
      priority: priority || 'medium',
      isPersistent: isPersistent !== false,
      senderId: memberId
    };

    const result = await notificationService.sendBulkNotifications(
      notificationData, 
      targetType, 
      targetData
    );
    
    res.json({ 
      success: true, 
      message: `Notifications sent to ${result.totalSent} recipients`,
      ...result
    });
  } catch (error) {
    console.error('Error sending bulk notifications:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to send bulk notifications' 
    });
  }
};

// Subscribe to push notifications
const subscribeToPush = async (req, res) => {
  try {
    const { memberId } = req.user;
    const { subscription } = req.body;
    const userAgent = req.get('User-Agent');

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid subscription data' 
      });
    }

    const result = await notificationService.savePushSubscription(
      memberId, 
      subscription, 
      userAgent
    );
    
    res.json({ 
      success: true, 
      message: 'Successfully subscribed to push notifications',
      subscriptionId: result.subscriptionId
    });
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to subscribe to push notifications' 
    });
  }
};

// Unsubscribe from push notifications
const unsubscribeFromPush = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const success = await notificationService.removePushSubscription(subscriptionId);
    
    if (success) {
      res.json({ 
        success: true, 
        message: 'Successfully unsubscribed from push notifications' 
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'Subscription not found' 
      });
    }
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to unsubscribe from push notifications' 
    });
  }
};

// Subscribe to FCM notifications
const subscribeFCM = async (req, res) => {
  try {
    const { memberId } = req.user;
    const { token, platform } = req.body;

    if (!token) {
      return res.status(400).json({ 
        success: false, 
        message: 'FCM token is required' 
      });
    }

    await notificationService.storeFCMToken(memberId, token, platform || 'web');
    
    res.json({ 
      success: true, 
      message: 'Successfully subscribed to FCM notifications'
    });
  } catch (error) {
    console.error('Error subscribing to FCM:', error);
    res.status(500).json({ success: false, message: 'Failed to subscribe to FCM notifications' });
  }
};

// Unsubscribe from FCM notifications
const unsubscribeFCM = async (req, res) => {
  try {
    const { memberId } = req.user;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        success: false, 
        message: 'FCM token is required' 
      });
    }

    await notificationService.removeFCMToken(memberId, token);
    
    res.json({ 
      success: true, 
      message: 'Successfully unsubscribed from FCM notifications'
    });
  } catch (error) {
    console.error('Error unsubscribing from FCM:', error);
    res.status(500).json({ success: false, message: 'Failed to unsubscribe from FCM notifications' });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  sendNotification,
  sendBulkNotifications,
  subscribeToPush,
  unsubscribeFromPush,
  subscribeFCM,
  unsubscribeFCM
};
