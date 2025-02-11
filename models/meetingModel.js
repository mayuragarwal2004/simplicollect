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

const updatePaymentStatus= async (meetingId, paymentStatus) => {
    return db("meetings")
        .where("meetingId", meetingId)
        .update({ paymentStatus: paymentStatus });
}


module.exports = {
    getMeetingById,
    getAllMeetings,
    updatePaymentStatus
};