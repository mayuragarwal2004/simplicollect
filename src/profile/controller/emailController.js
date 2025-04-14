const OtpModel = require('../model/otpModel');
const MemberModel = require('../model/profileModel');
const crypto = require('crypto');
const emailService = require('../services/emailService');
const db = require('../../config/db');


// Initiate email change process
exports.initiateEmailChange = async (req, res) => {
  try {
    const { memberId } = req.params;
    const member = await MemberModel.getById(memberId);
    
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    // Invalidate any previous OTPs
    await OtpModel.invalidatePreviousOTPs(memberId);

    const otpCode = generateOTP();
    const otpRecord = await OtpModel.createOTP(memberId, otpCode, member.email);
    console.log('OTP Record:', otpRecord);
    
    try {
      await emailService.sendOTPEmail(member.email, otpCode);
      console.log(`OTP sent to ${member.email}`);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue even if email fails - OTP is still valid
    }

    res.json({ 
      success: true, 
      message: 'OTP sent to current email',
      token: otpRecord.otp_id.toString()
    });
  } catch (error) {
    console.error('Error initiating email change:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error initiating email change',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Verify OTP sent to old email
exports.verifyOldEmailOTP = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { otp, token } = req.body;

    const verified = await OtpModel.verifyOTP(memberId, otp, token);
    
    res.json({ 
      success: true, 
      message: 'Current email verified successfully',
      token: token // Return same token for next steps
    });
  } catch (error) {
    console.error('Error verifying old email OTP:', error);
    res.status(400).json({ 
      success: false,
      message: error.message || 'Invalid or expired OTP'
    });
  }
};

exports.sendNewEmailOTP = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { newEmail, token } = req.body;

    // 1. Validate token
    const tokenId = parseInt(token, 10);

    if (isNaN(tokenId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid session token'
      });
    }

    // 2. Verify session is still valid
    const validToken = await OtpModel.getValidOTP(memberId, tokenId);
  
    if (!validToken) {
      return res.status(400).json({ 
        success: false,
        message: 'Session expired. Please start over.'
      });
    }

    // 3. Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email format'
      });
    }

    // 4. Check if email is different
    const member = await MemberModel.getById(memberId);
    if (member.email.toLowerCase() === newEmail.toLowerCase()) {
      return res.status(400).json({ 
        success: false,
        message: 'New email must be different'
      });
    }


    // Invalidate any previous OTPs
    await OtpModel.invalidatePreviousOTPs(memberId);

    // 5. Create new OTP
    const otpCode = generateOTP();
    const otpRecord = await OtpModel.createOTP(memberId, otpCode, newEmail);
    
    // 6. Send email (fire and forget)
    try {
      await emailService.sendOTPEmail(newEmail, otpCode);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue anyway - OTP is still valid
    }

    res.json({ 
      success: true,
      message: 'OTP sent to new email',
      token: otpRecord.otp_id.toString()
    });

  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error sending OTP'
    });
  }
};

// Verify new email OTP and update email
exports.verifyNewEmailAndUpdate = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { otp, token, newEmail } = req.body;

    console.log('*******************************new email otp verification *********************************');
    console.log('New Email:', newEmail);
    console.log('Token:', token);
    console.log('otp:', otp);


    // Verify the OTP
    const verified = await OtpModel.verifyOTP(memberId, otp, token);
    console.log('Verified OTP:', verified);
    
    // Update member email
    const updatedMember = await MemberModel.updateEmail(memberId, newEmail);
    console.log('Updated Member:', updatedMember);
    
    if (!updatedMember) {
      throw new Error('Failed to update email');
    }

    res.json({ 
      success: true, 
      message: 'Email updated successfully',
      data: {
        email: newEmail
      }
    });
  } catch (error) {
    console.error('Error verifying new email and updating:', error);
    res.status(400).json({ 
      success: false,
      message: error.message || 'Error updating email'
    });
  }
};

// Resend OTP to old email
exports.resendOldEmailOTP = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { token } = req.body;

    // Get the original OTP record
    const originalOTP = await db('otp_verifications')
      .where({
        otp_id: token,
        member_id: memberId
      })
      .first();

    if (!originalOTP) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid session' 
      });
    }

    // Invalidate the old OTP
    await OtpModel.invalidatePreviousOTPs(memberId);

    // Create new OTP
    const otpCode = generateOTP();
    const otpRecord = await OtpModel.createOTP(memberId, otpCode, originalOTP.email);
    
    try {
      await emailService.sendOTPEmail(originalOTP.email, otpCode);
      console.log(`Resent OTP to ${originalOTP.email}`);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue even if email fails - OTP is still valid
    }

    res.json({ 
      success: true, 
      message: 'OTP resent to current email',
      token: otpRecord.otp_id.toString()
    });
  } catch (error) {
    console.error('Error resending old email OTP:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error resending OTP',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper function to generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}