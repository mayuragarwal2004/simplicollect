const db = require("../../config/db");

const getMeetingById = async (meetingId) => {
  return db("meetings").where("meetingId", meetingId).select("*");
};

const getAllMeetings = async () => {
  return db("meetings").select("*");
};
const getAllMeetingsByChapterId = async (chapterId) => {
  return db("meetings")
    .where("chapterId", chapterId)
    .select(
      "meetingId",
      "chapterId",
      "meetingName",
      "meetingDate",
      "meetingTime",
      "meetingFeeMembers",
      "meetingFeeVisitors",
      "disabled as meetingDisabled"
    )
    .orderBy("meetingDate", "asc");
}

const getAllMeetingsUsingMemberIdAndChapterId = async (memberId, chapterId) => {
  return db("meetings as m")
    .leftJoin("members_meeting_mapping as mmm", function() {
      this.on("m.meetingId", "=", "mmm.meetingId").andOn("mmm.memberId", "=", db.raw("?", [memberId]));
    })
    .leftJoin("transactions as t", "mmm.transactionId", "t.transactionId")
    .select(
      "m.meetingId",
      "m.chapterId",
      "m.meetingName",
      "m.meetingDate",
      "m.meetingTime",
      "m.meetingFeeMembers",
      "m.meetingFeeVisitors",
      "m.disabled as meetingDisabled",
      "mmm.memberId",
      "mmm.notToPay",
      "mmm.notToPayReason",
      "mmm.isPaid",
      "t.payableAmount",
      "t.paidAmount",
      "t.paymentDate",
      "t.balanceAmount",
      "t.status",
      "t.statusUpdateDate"
    )
    .where((builder) => {
      if (chapterId) {
        builder.where("m.chapterId", chapterId);
      }
    })
    .orderBy("m.meetingDate", "asc");
};

// Fetch meetings by chapterId and termId
const getAllMeetingsByChapterAndTerm = async (chapterId, termId) => {
  return db("meetings as m")
    .join("term as tm", "m.termId", "tm.termId")
    .where({ "m.chapterId": chapterId, "m.termId": termId })
    .select(
      "m.meetingId",
      "m.chapterId",
      "m.termId",
      "m.meetingName",
      "m.meetingDate",
      "m.meetingTime",
      "m.meetingFeeMembers",
      "m.meetingFeeVisitors",
      "m.disabled as meetingDisabled",
      "tm.termName",
      "tm.status"
    )
    .orderBy("m.meetingDate", "asc");
};

const updatePaymentStatus = async (meetingId, paymentStatus) => {
  return db("meetings")
    .where("meetingId", meetingId)
    .update({ paymentStatus: paymentStatus });
};

module.exports = {
  getMeetingById,
  getAllMeetings,
  getAllMeetingsUsingMemberIdAndChapterId,
  updatePaymentStatus,
  getAllMeetingsByChapterId,
  getAllMeetingsByChapterAndTerm,
};
