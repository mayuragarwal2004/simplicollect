// routes/meetingRoutes.js
const express = require("express");
const meetingController = require("../controller/meetingController");

const router = express.Router();

router.get("/meetings/:chapterId", meetingController.getAllMeetings);
router.put("/:meetingId/pay", meetingController.updatePaymentStatus);
router.get("/:chapterId", meetingController.getAllMeetingsByChapterId);
module.exports = router;