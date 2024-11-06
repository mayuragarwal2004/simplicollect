const visitorModel = require('../models/visitorModel');

// Check if a visitor exists within 48 hours
const checkVisitor = async (req, res) => {
  const { phone } = req.query;
  try {
    const visitors = await visitorModel.findVisitorByPhoneAndTime(phone);
    if (visitors.length > 0) {
      res.json({ exists: true, visitor: visitors[0] });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new visitor entry
const addVisitor = async (req, res) => {
  const visitorData = req.body;
  try {
    const result = await visitorModel.addVisitor(visitorData);
    res.json({ message: 'Visitor added successfully', visitorId: result[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add feedback to an existing visitor
const addFeedback = async (req, res) => {
  const { mobile, feedbackScore, feedbackComments } = req.body;
  try {
    await visitorModel.addFeedback(mobile, { feedbackScore, feedbackComments });
    res.json({ message: 'Feedback added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  checkVisitor,
  addVisitor,
  addFeedback,
};
