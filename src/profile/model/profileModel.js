const db = require("../../config/db");
const bcrypt = require('bcryptjs');

// Get member by ID
const getById = async (memberId) => {
  return db('members')
    .where('memberId', memberId)
    .first();
};

// Update member name
const updateName = async (memberId, firstName, lastName) => {
  await db('members')
    .where('memberId', memberId)
    .update({ firstName, lastName });
  
  return getById(memberId); // Removed 'this.'
};

// Update member email
const updateEmail = async (memberId, email) => {
  await db('members')
    .where('memberId', memberId)
    .update({ email });
  
  return getById(memberId); // Removed 'this.'
};

// Update member phone number
const updatePhone = async (memberId, phoneNumber) => {
  await db('members')
    .where('memberId', memberId)
    .update({ phoneNumber });
  
  return getById(memberId); // Removed 'this.'
};

// Verify if email already exists (excluding current member)
const emailExists = async (email, excludeMemberId) => {
  const member = await db('members')
    .where('email', email)
    .whereNot('memberId', excludeMemberId)
    .first();
  
  return !!member;
};

// Verify if phone number already exists (excluding current member)
const phoneExists = async (phoneNumber, excludeMemberId) => {
  const member = await db('members')
    .where('phoneNumber', phoneNumber)
    .whereNot('memberId', excludeMemberId)
    .first();
  
  return !!member;
};

// Verify password (compare with hashed password in DB)
const verifyPassword = async (memberId, password) => {
  const member = await getById(memberId); // Removed 'this.'
  if (!member) return false;
  
  return bcrypt.compare(password, member.password);
};

module.exports = {
  updateName,
  getById,
  updateEmail,
  updatePhone,
  emailExists,
  phoneExists,
  verifyPassword
};