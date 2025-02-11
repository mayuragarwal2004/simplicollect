// routes/meetingRoutes.js
const express = require("express");
const meetingController = require("../controllers/meetingController");

const router = express.Router();

router.get("/meetings", meetingController.getAllMeetings);
router.put("/:meetingId/pay", meetingController.updatePaymentStatus);

module.exports = router;