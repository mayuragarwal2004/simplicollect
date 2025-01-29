// models/memberModel.js
const db = require("../config/db");

// Function to find a member by email
const findMemberByEmail = async (email) => {
  return db("members")
    .where("email", email)
    .first();
};

// Function to find a member by ID
const findMemberById = async (memberId) => {
  return db("members")
    .where("memberId", memberId)
    .first();
};

// Add member
const addMember = async (memberData) => {
  return db("members").insert(memberData);
};

const getMembers = async (chapterId) => {
  return db("memberchaptermapping")
    .where("chapterId", chapterId)
    .select("*");
};

module.exports = {
  findMemberByEmail,
  findMemberById,
  addMember,
  getMembers,
};
