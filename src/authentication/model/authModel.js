const db = require("../../config/db");
const { sendEMail } = require("../../config/smtp");
const { sendWhatsAppMessage } = require("../../config/whatsapp");

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to the user's email
const sendOTP = async (identifier) => {
  try {
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Lookup user by either email or phone number
    const user = await db("members")
      .where("email", identifier)
      .orWhere("phoneNumber", identifier)
      .first();

    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Save OTP to DB
    await db("otp_verifications").insert({
      member_id: user.memberId,
      otp_code: otp,
      expires_at: expiresAt,
    });

    // Send OTP to both email and phone
    const messages = [];

    if (user.email) {
      await sendEMail({
        to: user.email,
        subject: "Your OTP for Login",
        text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
      });
      messages.push("Email sent");
    }

    if (user.phoneNumber) {
      await sendWhatsAppMessage('otp', "91" + user.phoneNumber, { otp });
      messages.push("WhatsApp sent");
    }

    // Masking helpers
    const maskEmail = (email) => {
      const [name, domain] = email.split("@");
      const maskedName =
        name[0] + "*".repeat(Math.max(0, name.length - 2)) + name.slice(-1);
      return `${maskedName}@${domain}`;
    };

    const maskPhone = (phone) => {
      return phone.replace(
        /^(\d{2})\d+(\d{2})$/,
        (_, start, end) => `${start}${"*".repeat(phone.length - 4)}${end}`
      );
    };

    return {
      success: true,
      message: buildOtpSentMessage(
        user.email ? maskEmail(user.email) : null,
        user.phoneNumber ? maskPhone(user.phoneNumber) : null
      ),
      email: user.email ? maskEmail(user.email) : null,
      phoneNumber: user.phoneNumber ? maskPhone(user.phoneNumber) : null,
      notes: messages,
    };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false, message: "Failed to send OTP" };
  }
};

const buildOtpSentMessage = (maskedEmail, maskedPhone) => {
  if (maskedEmail && maskedPhone) {
    return `OTP has been sent to your email (${maskedEmail}) and phone number (${maskedPhone}).`;
  } else if (maskedEmail) {
    return `OTP has been sent to your email (${maskedEmail}).`;
  } else if (maskedPhone) {
    return `OTP has been sent to your phone number (${maskedPhone}).`;
  } else {
    return `OTP was generated, but no email or phone number was available to send it. Please contact support.`;
  }
};

// Verify OTP
const verifyOTP = async (identifier, otp) => {
  console.log("Verifying OTP for:", identifier, "OTP:", otp);

  try {
    // Find user by either email or phone number
    const user = await db("members")
      .where("email", identifier)
      .orWhere("phoneNumber", identifier)
      .first();

    if (!user) {
      return { success: false, message: "User not found" };
    }

    console.log("User found:", user);

    // Fetch OTP record for the user
    const otpRecord = await db("otp_verifications")
      .where({
        member_id: user.memberId,
        otp_code: otp,
        verified: false,
      })
      .where("expires_at", ">", new Date()) // Ensure OTP is not expired
      .orderBy("created_at", "desc") // Get the latest OTP entry
      .first();

    console.log("OTP Record:", otpRecord);

    // If no valid OTP is found
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
  const member = await db("members")
    .where((builder) => {
      builder.where("email", identifier).orWhere("phoneNumber", identifier);
    })
    .select("memberId", "email", "phoneNumber", "password") // Ensure password is included
    .first();
  return member;
};

module.exports = { sendOTP, verifyOTP, memberExistOrNot };
