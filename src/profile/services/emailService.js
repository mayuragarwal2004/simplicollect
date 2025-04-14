const { sendEMail } = require('../../config/smtp');

exports.sendOTPEmail = async (email, otpCode) => {
  const mailOptions = {
    to: email,
    subject: 'Your OTP for Email Change',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Email Change Verification</h2>
        <p>Your OTP code is: <strong>${otpCode}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this change, please ignore this email or contact support.</p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="font-size: 12px; color: #6b7280;">This is an automated message, please do not reply.</p>
      </div>
    `
  };

  return sendEMail(mailOptions);
};