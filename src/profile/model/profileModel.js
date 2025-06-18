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
  
  return getById(memberId); 
};

// Update member email
const updateEmail = async (memberId, email) => {
  const currentEmail=await getById(memberId);
  if (currentEmail.email === email) {
    throw new Error('New email cannot be the same as current email');
  }
  await db('members')
    .where('memberId', memberId)
    .update({ email: email });
  
  return getById(memberId);  
};

// Update member phone number
const updatePhone = async (memberId, phoneNumber) => {
  const currentEmail=getById(memberId);

  if (currentEmail.phoneNumber === phoneNumber) {
    throw new Error('New phone number cannot be the same as current phone number');
  }
  await db('members')
    .where('memberId', memberId)
    .update({ phoneNumber: phoneNumber });
  
  return getById(memberId);  
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
  const member = await getById(memberId);  
  if (!member) return false;
  
  return bcrypt.compare(password, member.password);
};
const updatePassword = async (memberId, currentPassword, newPassword) => {
  // Get current password hash
  const member = await db('members')
    .where('memberId', memberId)
    .select('password')
    .first();

  if (!member) {
    throw new Error('Member not found');
  }

  // Verify current password
  const isMatch = await bcrypt.compare(currentPassword, member.password);
  if (!isMatch) {
    throw new Error('Current password is incorrect');
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update password
  await db('members')
    .where('memberId', memberId)
    .update({ password: hashedPassword });

  return true;
};

module.exports = {
  updateName,
  getById,
  updateEmail,
  updatePhone,
  emailExists,
  phoneExists,
  verifyPassword,
  updatePassword
};