const db = require('../../../config/db');
const { v4: uuidv4 } = require('uuid');

// Create a new notification
const createNotification = async (notificationData) => {
  const {
    title,
    message,
    type = 'info',
    priority = 'medium',
    isPersistent = true,
    recipientId,
    senderId = null,
    chapterId = null,
    relatedEntityType = null,
    relatedEntityId = null,
    scheduledAt = null
  } = notificationData;

  const notificationId = uuidv4();
  const sentAt = scheduledAt ? null : new Date();

  const notificationRecord = {
    notificationId,
    title,
    message,
    type,
    priority,
    isPersistent,
    recipientId,
    senderId,
    chapterId,
    relatedEntityType,
    relatedEntityId,
    scheduledAt,
    sentAt
  };

  await db('notifications').insert(notificationRecord);
  return { notificationId, ...notificationData };
};

// Get notifications for a specific user
const getNotificationsByUser = async (memberId, options = {}) => {
  const { limit = 50, offset = 0, unreadOnly = false, type = null } = options;
  
  let query = db('notifications as n')
    .leftJoin('members as s', 'n.senderId', 's.memberId')
    .select('n.*', db.raw('CONCAT(s.firstName, " ", s.lastName) as senderName'))
    .where('n.recipientId', memberId);
  
  if (unreadOnly) {
    query = query.where('n.isRead', 0);
  }
  
  if (type) {
    query = query.where('n.type', type);
  }
  
  const notifications = await query
    .orderBy('n.createdAt', 'desc')
    .limit(limit)
    .offset(offset);

  return notifications;
};

// Mark notification as read
const markAsRead = async (notificationId, memberId) => {
  const result = await db('notifications')
    .where({ notificationId, recipientId: memberId })
    .update({ 
      isRead: 1, 
      readAt: new Date() 
    });
  
  return result > 0;
};

// Mark all notifications as read for a user
const markAllAsRead = async (memberId) => {
  const result = await db('notifications')
    .where({ recipientId: memberId, isRead: 0 })
    .update({ 
      isRead: 1, 
      readAt: new Date() 
    });
  
  return result;
};

// Get unread count for a user
const getUnreadCount = async (memberId) => {
  const result = await db('notifications')
    .count('* as count')
    .where({ recipientId: memberId, isRead: 0 })
    .first();
  
  return result.count;
};

// Delete notification
const deleteNotification = async (notificationId, memberId) => {
  const result = await db('notifications')
    .where({ notificationId, recipientId: memberId })
    .del();
  
  return result > 0;
};

// Get members by target criteria for bulk notifications
const getMembersByTarget = async (targetType, targetData) => {
  let query = db('members')
    .select('memberId', 'firstName', 'lastName', 'email', 'phoneNumber');

  switch (targetType) {
    case 'chapter':
      // Join with member_chapter_mapping table
      query = query
        .join('member_chapter_mapping as mcm', 'members.memberId', 'mcm.memberId')
        .where('mcm.chapterId', targetData.chapterId)
        .where('mcm.status', 'joined');
      break;
      
    case 'role':
      query = query
        .join('member_chapter_mapping as mcm', 'members.memberId', 'mcm.memberId')
        .where('members.role', targetData.role)
        .where('mcm.status', 'joined');
      
      if (targetData.chapterId) {
        query = query.where('mcm.chapterId', targetData.chapterId);
      }
      break;
      
    case 'custom':
      if (targetData.memberIds && targetData.memberIds.length > 0) {
        query = query.whereIn('memberId', targetData.memberIds);
      } else {
        // Handle phone numbers and emails
        query = query.where((qb) => {
          if (targetData.phoneNumbers && targetData.phoneNumbers.length > 0) {
            qb.orWhereIn('phoneNumber', targetData.phoneNumbers);
          }
          if (targetData.emails && targetData.emails.length > 0) {
            qb.orWhereIn('email', targetData.emails);
          }
        });
      }
      break;
      
    case 'all':
    default:
      // No additional filters for 'all'
      break;
  }

  const members = await query;
  return members;
};

// Create bulk notifications
const createBulkNotifications = async (notificationData, recipients) => {
  const notifications = recipients.map(recipient => ({
    notificationId: uuidv4(),
    title: notificationData.title,
    message: notificationData.message,
    type: notificationData.type || 'info',
    priority: notificationData.priority || 'medium',
    isPersistent: notificationData.isPersistent !== false,
    recipientId: recipient.memberId,
    senderId: notificationData.senderId || null,
    chapterId: notificationData.chapterId || null,
    relatedEntityType: notificationData.relatedEntityType || null,
    relatedEntityId: notificationData.relatedEntityId || null,
    scheduledAt: notificationData.scheduledAt || null,
    sentAt: notificationData.scheduledAt ? null : new Date()
  }));

  await db('notifications').insert(notifications);
  return { count: notifications.length, notifications };
};

module.exports = {
  createNotification,
  getNotificationsByUser,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification,
  getMembersByTarget,
  createBulkNotifications
};
