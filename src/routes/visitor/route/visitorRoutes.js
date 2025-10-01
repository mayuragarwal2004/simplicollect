const express = require("express");
const router = express.Router();
const visitorController = require("../controller/visitorController");
const { authenticateToken } = require("../../../middlewares/authMiddleware");

// Route to check if a visitor exists
router.get("/checkVisitor", visitorController.checkVisitor);

// Route to add a new visitor
router.post("/addVisitor", visitorController.addVisitor);

// Route to add feedback for a visitor
router.post("/addFeedback", visitorController.addFeedback);

// Route to verify visitor link
router.get(
  "/verifyVisitorLink/:chapterSlug",
  visitorController.verifyVisitorLink
);

// List of all visitor by chapter id
router.get("/visitorList/:chapterId", visitorController.visitorList);
router.get("/getChapterMeetings/:chapterId", visitorController.getChapterMeetings);

// List of all visitor by chapter id
router.post(
  "/mark-as-paid",
  authenticateToken,
  visitorController.markAsPaid
);

// Delete visitor by visitor id
router.delete(
  "/deleteVisitor/:visitorId",
  authenticateToken,
  visitorController.deleteVisitor
);
router.get("/:visitorId", visitorController.getVisitorById);
router.put(
  "/updateVisitor/:visitorId",
  authenticateToken,
  visitorController.updateVisitor
);
module.exports = router;
