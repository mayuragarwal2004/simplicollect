const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
router.use(express.json());

// Login users using JWT

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
module.exports = router;