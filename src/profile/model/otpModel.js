const db = require('../../config/db');

// Generate a random 6-digit OTP

// Create OTP record
exports.createOTP = async (memberId, otpCode, email) => {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
  
  // For MySQL which doesn't support RETURNING properly
  const [insertId] = await db('otp_verifications').insert({
    member_id: memberId,
    otp_code: otpCode,
    created_at: db.fn.now(),
    expires_at: expiresAt,
    verified: 0
  });

  // Fetch the newly created record
  const [otpRecord] = await db('otp_verifications')
    .where('otp_id', insertId)
    .select('*');

  if (!otpRecord) {
    throw new Error('Failed to create OTP record');
  }

  return otpRecord;
};

// Verify OTP
exports.verifyOTP = async (memberId, otpCode, token) => {
  const tokenId = parseInt(token, 10);
  if (isNaN(tokenId)) {
    throw new Error('Invalid token format');
  }
  console.log("****************************************************");
  console.log('Token ID model:', tokenId); // Debugging line
  console.log('OTP Code model:', otpCode); // Debugging line  
  console.log('Member ID model:', memberId); // Debugging line


  const result = await db('otp_verifications')
    .where({
      member_id: memberId,
      otp_code: otpCode,
      otp_id: tokenId,
      verified: 0
    })
    .where('expires_at', '>', db.fn.now())
    .update({
      verified: 1,
    });

  if (result === 0) {
    throw new Error('No matching OTP found');
  }

  return db('otp_verifications').where('otp_id', tokenId).first();
};

// Check if valid OTP exists
exports.getValidOTP = async (memberId, token) => {
  const tokenId = parseInt(token, 10);
  console.log('Token ID model:', tokenId); // Debugging line
  if (isNaN(tokenId)) {
    return null;
  }

  return db('otp_verifications')
    .where({
      member_id: memberId,
      otp_id: tokenId,
      verified: 1
    })
    .where('expires_at', '>', db.fn.now())
    .first();
};

// Delete expired OTPs
exports.cleanupExpiredOTPs = async () => {
  return db('otp_verifications')
    .where('expires_at', '<', db.fn.now())
    .del();
};

// Invalidate all previous OTPs for a member
exports.invalidatePreviousOTPs = async (memberId) => {
  return db('otp_verifications')
    .where({
      member_id: memberId,
      verified: 0
    })
    .update({
      expires_at: db.fn.now()
    });
};