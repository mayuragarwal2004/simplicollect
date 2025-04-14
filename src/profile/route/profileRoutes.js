const express = require("express");
const router = express.Router();

const profileControllers = require("../controller/profileControllers");
const emailController = require('../controller/emailController');

router.put("/:memberId/name",profileControllers.updateName);
router.post("/:memberId/initiate-email-change",emailController.initiateEmailChange);


// Send OTP to new email
router.post('/:memberId/send-new-email-otp',emailController.sendNewEmailOTP);
router.post('/:memberId/verify-old-email-otp',emailController.verifyOldEmailOTP);
  
  // Verify OTP for new email and update
  router.post('/:memberId/verify-new-email-and-update',emailController.verifyNewEmailAndUpdate);
  
  // Resend OTP
  router.post('/:memberId/resend-old-email-otp',emailController.resendOldEmailOTP);
  
module.exports = router;