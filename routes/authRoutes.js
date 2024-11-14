const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login users using JWT

router.post('/login', authController.login);

// Register users using JWT
router.post('/register', authController.register);

// Refresh access token using refresh token
router.post('/refresh', authController.refreshAccessToken);

module.exports = router;