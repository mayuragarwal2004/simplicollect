// models/memberModel.js
const db = require("../../config/db");

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
  return db("members").insert(memberData);
  db("memberschaptermapping").insert({
    memberId: memberData.memberId,
    chapterId: memberData.chapterId,
  });
};

const getMembers = async (chapterId, page = 0, rows = 10) => {
  const offset = parseInt(page, 10) * parseInt(rows, 10);

  const data = await db("member_chapter_mapping as mmm")
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
    )
    .limit(rows)
    .offset(offset);

  const totalRecords = await db("member_chapter_mapping as mmm")
    .where("mmm.chapterId", chapterId)
    .join("members as m", "mmm.memberId", "m.memberId")
    .leftJoin("roles as r", "mmm.roleId", "r.roleId")
    .count("m.memberId as totalRecords")
    .first();

  return { data, totalRecords: totalRecords.totalRecords };
};

const getAllMembers = async (chapterId) => {
  return db("member_chapter_mapping as mmm")
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
  getAllMembers,
};
