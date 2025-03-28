const db = require("../../config/db");

// Function to find a member by its ID
const findMemberById = async (memberId) => {
  return db("members") // Update to "members" table
    .where("memberId", memberId) // Update to "memberId"
    .first();
};

// Function to update member details
const updateMember = async (memberId, memberData) => {
  return db("members")
    .where("memberId", memberId)
    .update(memberData)
    .returning("*");
};

// Function to get all members (admin has access to all)
const getAllMembers = async (rows, page) => {
  return db("members")
      .orderBy("memberName", "asc")
      .limit(rows)
      .offset(page * rows);
};



// Function to create a new member
const createMember = async (memberData) => {
  return db("members")
    .insert(memberData)
    .returning("*");
};

// Function to delete a member by its ID
const deleteMember = async (memberId) => {
  return db("members")
    .where("memberId", memberId)
    .del();
};

module.exports = {
  findMemberById,
  updateMember,
  getAllMembers,
  createMember,
  deleteMember,
};
