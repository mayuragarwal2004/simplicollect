// models/memberModel.js
const db = require("../config/db");

// Function to find a member by email
const findMemberByEmail = async (email) => {
  return db("members").where("email", email).first();
};

// Function to find a member by ID
const findMemberById = async (memberId) => {
  return db("members").where("memberId", memberId).first();
};

// Add member
const addMember = async (memberData) => {
  return db("members").insert(memberData)
  db("memberschaptermapping").insert({ memberId: memberData.memberId, chapterId: memberData.chapterId });
    
};

const getMembers = async (chapterId) => {
  return db("memberchaptermapping as mmm")
    .where("mmm.chapterId", chapterId)
    .join("members as m", "mmm.memberId", "m.memberId")
    .leftJoin("roles as r", "mmm.roleId", "r.roleId")
    .select(
      "r.*",
      "m.memberId",
      "m.firstName",
      "m.lastName",
      "m.phoneNumber",
      "m.email",
      "mmm.*"
    );
};

module.exports = {
  findMemberByEmail,
  findMemberById,
  addMember,
  getMembers,
};
