// controllers/meetingController.js
const Meeting = require("../models/meetingModel");

const getAllMeetings = async (req, res) => {
  const { memberId } = req.user;
  const { chapterId } = req.query;

  try {
    const meetings = await Meeting.getAllMeetingsUsingMemberIdAndChapterId(memberId, chapterId);
    res.json(meetings);
  } catch (error) {
    console.error("Error fetching meetings:", error);
    res.status(500).json({ error: "Failed to fetch meetings" });
  }
};

const updatePaymentStatus = async (req, res) => {
  const { meetingId } = req.params;
  try {
    await Meeting.updatePaymentStatus(meetingId);
    res.json({ message: "Payment status updated successfully" });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ error: "Failed to update payment status" });
  }
};

module.exports = {
  getAllMeetings,
  updatePaymentStatus,
};