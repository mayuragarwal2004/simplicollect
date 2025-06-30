// controllers/meetingController.js
const Meeting = require("../model/meetingModel");

const getAllMeetings = async (req, res) => {
  let { memberId } = req.query;
  if (!memberId) {
    memberId = req.user.memberId;
  }
  const { chapterId } = req.query;

  try {
    const meetings = await Meeting.getAllMeetingsUsingMemberIdAndChapterId(
      memberId,
      chapterId
    );
    console.log({ meetings });

    res.json(meetings);
  } catch (error) {
    console.error("Error fetching meetings:", error);
    res.status(500).json({ error: "Failed to fetch meetings" });
  }
};
const getAllMeetingsByChapterId = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const meetings = await Meeting.getAllMeetingsByChapterId(chapterId);
    console.log({ meetings });

    res.json(meetings);
  } catch (error) {
    console.error("Error fetching meetings:", error);
    res.status(500).json({ error: "Failed to fetch meetings" });
  }
};

// Fetch meetings by chapterId and termId
const getAllMeetingsByChapterAndTermController = async (req, res) => {
  const { chapterId, termId } = req.params;
  try {
    const meetings = await Meeting.getAllMeetingsByChapterAndTerm(chapterId, termId);
    res.json(meetings);
  } catch (error) {
    console.error("Error fetching meetings by chapter and term:", error);
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
  getAllMeetingsByChapterId,
  getAllMeetingsByChapterAndTermController,
};
