const db = require("../config/db");
const { sendEMail } = require("../config/smtp");

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to the user's email
const sendOTP = async (email) => {
  try {
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    // Save OTP to the database
    const user = await db("members").where("email", email).first();
    if (!user) {
      return { success: false, message: "User not found" };
    }

    console.log({ email });

    await db("otp_verifications").insert({
      member_id: user.memberId,
      otp_code: otp,
      expires_at: expiresAt,
    });

    await sendEMail({
      to: email,
      subject: "Your OTP for Login",
      text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
    });

    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false, message: "Failed to send OTP" };
  }
};

// Verify OTP
const verifyOTP = async (email, otp) => {
  console.log(email, otp);
  try {
    const user = await db("members").where("email", email).first();
    if (!user) {
      return { success: false, message: "User not found" };
    }
    console.log(user, "user");
    const otpRecord = await db("otp_verifications")
      .where({
        member_id: user.memberId,
        otp_code: otp,
        verified: false,
      })
      .where("expires_at", ">", new Date())
      .orderBy("created_at", "desc") // Get the latest OTP
      .first();

    console.log(otpRecord, "otpRecord");
    if (!otpRecord) {
      return { success: false, message: "Invalid or expired OTP" };
    }
    // Mark OTP as verified
    await db("otp_verifications")
      .where({ otp_id: otpRecord.otp_id })
      .update({ verified: 1 });

    return { success: true, message: "OTP verified successfully" };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, message: "Failed to verify OTP" };
  }
};

const memberExistOrNot = async (identifier) => {
 const member= await  db("members")
    .where((builder) => {
      builder.where("email", identifier).orWhere("phoneNumber", identifier);
    })
    .select("memberId", "email", "phoneNumber", "password") // Ensure password is included
    .first();
    return member;
};

module.exports = { sendOTP, verifyOTP, memberExistOrNot };
