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

module.exports = {
  findMemberByEmail,
  findMemberById,
};
