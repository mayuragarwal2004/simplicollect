// models/packageModel.js
const db = require("../config/db");

const getPackageById = async (packageId) => {
    return db("packages")
        .where("packageId", packageId)
        .select("*");
}

const getPackagesByParentType = async (parentType) => {
    return db("packages")
        .where("packageParent", parentType) // Ensure the column name matches your database schema
        .select("*");
};
const getAllPackages = async () => {
    return db("packages")
        .select("*");
}

const getPendingMeetings = async () => {
    return db("membersmeetingmapping as mmm")
        .leftJoin("packages as p", "mmm.packageId", "p.packageId")
        .leftJoin("members as mem", "mmm.memberId", "mem.memberId")
        .where("mmm.status", "Pending stage 1")
        .select(
            "mmm.memberId",
            "mem.firstName",
            "mem.lastName",
            "mmm.meetingId",
            "mmm.packageId",
            "p.packageName",
            "mmm.status",
            "mmm.statusUpdateDate"
        );
};

const approveMeeting = async (memberId) => {
    return db("membersmeetingmapping")
        .where("memberId", memberId)
        .update({ status: "Confirmed" });
};


module.exports = {
    getPackageById,
    getAllPackages,
    getPackagesByParentType,
    getPendingMeetings,
    approveMeeting,
};
