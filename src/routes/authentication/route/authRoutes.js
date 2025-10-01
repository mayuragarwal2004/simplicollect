const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
router.use(express.json());

// Login users using JWT
router.post("/send-whatsapp-message",authController.sendWhatsappMessage);
router.post('/login', authController.login);

// Register users using JWT
router.post('/register', authController.register);

// Refresh access token using refresh token
router.post('/refresh', authController.refreshAccessToken);
router.post('/login', authController.login);

router.post("/forgot-password", authController.forgotPassword);

// Reset password
router.post("/reset-password", authController.resetPassword);
router.post("/send-otp", authController.sendOtpForLogin);
router.post("/verify-otp", authController.verifyOtpLogin);
router.post("/check-member", authController.meberexists);
module.exports = router;