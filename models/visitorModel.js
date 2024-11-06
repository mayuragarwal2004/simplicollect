const db = require('../config/db');

// Function to check if a visitor entry exists within the last 48 hours
const findVisitorByPhoneAndTime = async (phone) => {
  return db('visitors')
    .where('mobile', phone)
    .andWhere('createdAt', '>=', db.raw('NOW() - INTERVAL 48 HOUR'))
    .andWhere((builder) => {
      builder.whereNull('feedbackScore').orWhereNull('feedbackComments');
    });
};

// Function to insert a new visitor entry
const addVisitor = async (visitorData) => {
  return db('visitors').insert(visitorData);
};

// Function to update feedback for an existing visitor
const addFeedback = async (phone, feedbackData) => {
  return db('visitors')
    .where('mobile', phone)
    .update(feedbackData);
};

module.exports = {
  findVisitorByPhoneAndTime,
  addVisitor,
  addFeedback,
};
