const visitorModel = require("../model/visitorModel");
const { v4: uuidv4 } = require("uuid");
const db = require("../../config/db");
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
const getVisitorById = async (req, res) => {
  const { visitorId } = req.params;
  try {
    const visitor = await visitorModel.getVisitorById(visitorId);
    if (visitor) {
      res.json(visitor);
    } else {
      res.status(404).json({ message: "Visitor not found" });
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
    meetingId: visitorData.meetingId 
  } 
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add feedback to an existing visitor
const addFeedback = async (req, res) => {
  const { visitorId, ...feedbackData } = req.body;
  try {
    await visitorModel.addFeedback(visitorId, feedbackData);
    res.json({ message: "Feedback added successfully" });
    meetingId: feedbackData.meetingId 

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

    // Get meetings for this chapter
    const meetings = {
      upcoming: await visitorModel.getUpcomingMeetings(chapterDetails.chapterId),
      recent: await visitorModel.getRecentMeetings(chapterDetails.chapterId)
    };

    res.json({ ...chapterDetails, meetings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const visitorList = async (req, res) => {
  const { chapterId } = req.params;
  const {meetingId,date,startDate,endDate} = req.query;
  try {
    let query=db("visitors").where("chapterId",chapterId);
    if(meetingId){
      query=query.where("meetingId",meetingId);
    }
    if(startDate&&endDate){
      query=query.whereBeetween("chapterVisitDate",[startDate,endDate]);
    }
    if(date){
      
    }
    const visitors=await query.select("*");
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
const getChapterMeetings = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const upcoming = await visitorModel.getUpcomingMeetings(chapterId);
    const recent = await visitorModel.getRecentMeetings(chapterId);
    res.json({ upcoming, recent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateVisitor = async (req, res) => {
  const { visitorId } = req.params;
  const data = req.body;
  console.log("Update Visitor Data:", data);
  const chapterVisitDate=req.body.chapterVisitDate;
  const paymentRecordedDate=req.body.paymentRecordedDate;
  const createdAt = req.body.createdAt;
if (paymentRecordedDate) {
  const date = new Date(paymentRecordedDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');

  data.paymentRecordedDate = `${year}-${month}-${day}`;
}
 if (chapterVisitDate) {
  const date = new Date(chapterVisitDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');

  data.chapterVisitDate = `${year}-${month}-${day}`;
}
if(createdAt){
  const date = new Date(createdAt);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  data.createdAt = `${year}-${month}-${day}`;
}
  try {
    await visitorModel.updateVisitor(visitorId, data);
    res.json({ message: "Visitor updated successfully" });
  } catch (error) {
    console.log(error.message)
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
  getChapterMeetings,
  verifyVisitorLink: verifyVisitorLink,
  getVisitorById,
  updateVisitor
};
