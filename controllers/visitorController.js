const visitorModel = require("../models/visitorModel");
const { v4: uuidv4 } = require("uuid");

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
  let visitorData = req.body;

  visitorData.visitorId = uuidv4();
  console.log(visitorData);

  try {
    const result = await visitorModel.addVisitor(visitorData);
    res.json({ message: "Visitor added successfully", visitorId: result[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add feedback to an existing visitor
const addFeedback = async (req, res) => {
  const { visitorId, ...feedbackData } = req.body;
  try {
    await visitorModel.addFeedback(visitorId, feedbackData);
    res.json({ message: "Feedback added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyVisitorLink = async (req, res) => {
  const { chapterSlug } = req.params;

  try {
    const chapterDetails = await visitorModel.getChapterDetailsFromSlug(
      chapterSlug
    );
    if (!chapterDetails.chapterId) {
      return res.status(200).json({ message: "Chapter not found" });
    }

    res.json(chapterDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const visitorList = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const visitors = await visitorModel.getVisitorListByChapterId(chapterId);
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markAsPaid = async (req, res) => {
  const { visitorId } = req.body;
  const { memberId } = req.user;

  const data = {
    paymentAcceptedMemberId: memberId,
    paymentImageLink: req.body.paymentImageLink || null,
    paymentAmount: req.body.paymentAmount || null,
    paymentRecordedDate: new Date(),
    paymentType: req.body.paymentType || null,
  };

  try {
    await visitorModel.markAsPaid(visitorId, data);
    res.json({ message: "Visitor marked as paid" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteVisitor = async (req, res) => {
  const { visitorId } = req.params;
  try {
    await visitorModel.deleteVisitor(visitorId);
    res.json({ message: "Visitor deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  checkVisitor,
  addVisitor,
  addFeedback,
  verifyVisitorLink,
  visitorList,
  markAsPaid,
  deleteVisitor,
};
