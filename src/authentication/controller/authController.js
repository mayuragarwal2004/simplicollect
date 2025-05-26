const db = require("../../config/db");
const { sendOTP, verifyOTP, memberExistOrNot } = require("../model/authModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { WhatsAppMessage } = require("../../config/whatsapp");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_EXPIRY = "10d";
const REFRESH_TOKEN_EXPIRY = "30d";

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await db("members").where("email", email).first();
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [userId] = await db("members").insert({
      email,
      password: hashedPassword,
    });

    const user = { id: userId, email };
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.status(201).json({ accessToken, refreshToken });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Helper function to generate tokens
// Function to register a new user using JWT

// Function to refresh access token using a refresh token
const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const newAccessToken = generateAccessToken({
      id: decoded.id,
      email: decoded.email,
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

// Helper function to generate tokens
const generateAccessToken = (user) => {
  return jwt.sign({ memberId: user.memberId, email: user.email }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ memberId: user.memberId, email: user.email }, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

// Check if the user has a password set
const hasPasswordSet = async (email) => {
  const user = await db("members").where("email", email).first();
  return user && user.password !== null;
};

// Login with password or OTP
const login = async (req, res) => {
  const { identifier, password, otp } = req.body; // 'identifier' can be email or phone

  try {
    // Check if the identifier is an email or a phone number
    const user = await db("members")
      .where("email", identifier)
      .orWhere("phoneNumber", identifier)
      .first();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Password-based login
    if (user.password) {
      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }
      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid password" });
      }
    } else {
      // OTP-based login
      if (!otp) {
        return res.status(400).json({ message: "OTP is required" });
      }
      const otpResponse = await verifyOTP(user.email, otp); // OTP verification
      if (!otpResponse.success) {
        return res.status(401).json({ message: otpResponse.message });
      }
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Forgot password: Send OTP
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await db("members").where("email", email).first();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otpResponse = await sendOTP(email);
    return res.status(otpResponse.success ? 200 : 500).json(otpResponse);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Reset password: Verify OTP and set new password
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await db("members").where("email", email).first();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otpResponse = await verifyOTP(email, otp);
    if (!otpResponse.success) {
      return res.status(401).json({ message: otpResponse.message });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db("members").where("email", email).update({ password: hashedPassword });

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
const sendOtpForLogin = async (req, res) => {
  const { identifier } = req.body; // Can be email or phone number

  try {
    // Find user by either email or phone number
    const user = await db("members")
      .where("email", identifier)
      .orWhere("phoneNumber", identifier)
      .first();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send OTP to the provided identifier (email or phone)
    const response = await sendOTP(identifier);

    return res.status(response.success ? 200 : 500).json(response);
  } catch (error) {
    console.error("Error in sendOtpForLogin:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const verifyOtpLogin = async (req, res) => {
  const { identifier, otp, password } = req.body;
  console.log(otp)
  console.log("Verifying OTP for:", identifier);
  try {
    console.log("Verifying OTP for:", identifier);

    const response = await verifyOTP(identifier, otp);
    if (!response.success) {
      return res.status(400).json(response);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db("members")
      .where("email", identifier)
      .orWhere("phoneNumber", identifier)
      .update({ password: hashedPassword });

    const user = await db("members")
      .where("email", identifier)
      .orWhere("phoneNumber", identifier)
      .first();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Error verifying OTP login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const meberexists = async (req, res) => {
  const { identifier } = req.body; // Can be email or phone number

  try {
    const member = await memberExistOrNot(identifier);

    if (!member) {
      return res.json({ exists: false, defaultOTP: false });
    }

    // Check if the user has a password set
    const hasPassword = member.password && member.password.trim() !== "";

    return res.json({ exists: true, defaultOTP: !hasPassword });
  } catch (error) {
    console.error("Error in checkMember:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
// Export the functions
const sendWhatsappMessage=async (req,res)=>{
  try {
    const { phoneNumber, appName, message } = req.body;

    if (!phoneNumber || !appName || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: phoneNumber, appName, or message.'
      });
    }

    const messageSid = await WhatsAppMessage(phoneNumber, { appName, message });

    res.status(200).json({
      success: true,
      message: 'WhatsApp message sent successfully.',
      sid: messageSid
    });
  } catch (error) {
    console.error('Error in /sendmessage route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send WhatsApp message.',
      error: error.message
    });
  }
}

module.exports = {
  login,
  register,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  sendOtpForLogin,
  verifyOtpLogin,
  meberexists,
  sendWhatsappMessage,
};
