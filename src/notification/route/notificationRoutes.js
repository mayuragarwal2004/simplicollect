const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notificationController');
const { AuthenticateAdmin } = require('../../middlewares/authMiddleware');

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'notification-service',
    timestamp: new Date().toISOString()
  });
});

// User notification routes
router.get('/', notificationController.getNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.patch('/:notificationId/read', notificationController.markAsRead);
router.patch('/mark-all-read', notificationController.markAllAsRead);
router.delete('/:notificationId', notificationController.deleteNotification);

// Push notification subscription routes (Web Push - legacy)
router.post('/subscribe', notificationController.subscribeToPush);
router.delete('/subscribe/:subscriptionId', notificationController.unsubscribeFromPush);

// FCM notification subscription routes
router.post('/fcm/subscribe', notificationController.subscribeFCM);
router.delete('/fcm/unsubscribe', notificationController.unsubscribeFCM);

// Admin routes for sending notifications
router.post('/send', AuthenticateAdmin, notificationController.sendNotification);
router.post('/send-bulk', AuthenticateAdmin, notificationController.sendBulkNotifications);

module.exports = router;
