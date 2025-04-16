const express = require('express');
const router = express.Router();
const memberController = require('../controller/profileControllers');

// Update member name
router.put('/:memberId/name', memberController.updateName);

// Update member email (requires password verification)
router.put('/:memberId/email', memberController.updateEmail);

// Update member phone (requires password verification)
router.put('/:memberId/phone', memberController.updatePhone);

module.exports = router;