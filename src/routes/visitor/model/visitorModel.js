const db = require("../../../config/db");

const getUpcomingMeetings = async (chapterId) => {
  const currentDate = new Date().toISOString().split('T')[0];
  return db("meetings")
    .where("chapterId", chapterId)
    .andWhere("disabled", 0)
    .andWhere("meetingDate", ">=", currentDate)
    .orderBy("meetingDate", "asc")
    .limit(2);
};

const getRecentMeetings = async (chapterId) => {
  const currentDate = new Date().toISOString().split('T')[0];
  return db("meetings")
    .where("chapterId", chapterId)
    .andWhere("disabled", 0)
    .andWhere("meetingDate", "<", currentDate)
    .orderBy("meetingDate", "desc")
    .limit(2);
};

const getMeetingById = async (meetingId) => {
  return db("meetings").where("meetingId", meetingId).first();
};

// Function to check if a visitor entry exists within the last 48 hours
const findVisitorByPhoneAndTime = async (phone) => {
  return db("visitors")
    .where("mobileNumber", phone)
    .andWhere("createdAt", ">=", db.raw("NOW() - INTERVAL 48 HOUR"))
    .andWhere((builder) => {
      builder.whereNull("feedbackScore").orWhereNull("feedbackComments");
    });
};
const getVisitorById = async (visitorId) => {
  return db("visitors").where("visitorId", visitorId).first();
}
// Function to insert a new visitor entry
const addVisitor = async (visitorData) => {
  return db("visitors").insert(visitorData).insert({
    ...visitorData,
    meetingId:visitorData.meetingId
  });

};

// Function to update feedback for an existing visitor
const addFeedback = async (visitorId, feedbackData) => {
  return db("visitors").where("visitorId", visitorId).update({
    ...feedbackData,
    meetingId: feedbackData.meetingId 
  });
};

const getChapterDetailsFromSlug = async (chapterSlug) => {
  return db("chapters").where("chapterSlug", chapterSlug).select("*").first();
};

const getVisitorListByChapterId = async (chapterId,filters={}) => {
  let query = db("visitors").where("chapterId", chapterId);
  if (filters.meetingId) {
    query = query.where("meetingId", filters.meetingId);
  }
  if (filters.startDate && filters.endDate) {
    query = query.whereBetween("chapterVisitDate", [filters.startDate, filters.endDate]);
  }
  return query.select("*");
};


const markAsPaid = async (visitorId, data) => {
  return db("visitors").where("visitorId", visitorId).update(data);
};

const deleteVisitor = async (visitorId) => {
  return db("visitors").where("visitorId", visitorId).del();
}
const updateVisitor = async (visitorId, data) => {
  return db("visitors").where("visitorId", visitorId).update(data);
}
module.exports = {
  findVisitorByPhoneAndTime,
  addVisitor,
  addFeedback,
  getChapterDetailsFromSlug,
  getVisitorListByChapterId,
  markAsPaid,
  deleteVisitor,
  getUpcomingMeetings,
  getRecentMeetings,
  getMeetingById,
  getVisitorById,
  updateVisitor
};
