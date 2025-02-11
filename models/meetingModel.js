const db = require("../config/db");

const getMeetingById = async (meetingId) => {
    return db("meetings")
        .where("meetingId", meetingId)
        .select("*");
}

const getAllMeetings = async () => {
    return db("meetings")
        .select("*");
}

const getAllMeetingsUsingMemberIdAndChapterId = async (memberId, chapterId) => {
    return db("meetings")
        .join("membersmeetingmapping", "meetings.meetingId", "membersmeetingmapping.meetingId")
        .where("membersmeetingmapping.memberId", memberId)
        .andWhere("meetings.chapterId", chapterId)
        .select("*");
}

const updatePaymentStatus= async (meetingId, paymentStatus) => {
    return db("meetings")
        .where("meetingId", meetingId)
        .update({ paymentStatus: paymentStatus });
}


module.exports = {
    getMeetingById,
    getAllMeetings,
    getAllMeetingsUsingMemberIdAndChapterId,
    updatePaymentStatus
};