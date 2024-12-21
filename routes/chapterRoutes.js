// routes/chapterRoutes.js
const express = require("express");
const router = express.Router();
const chapterController = require("../controllers/chapterControllers");

router.get("/", chapterController.getAllChaptersController);

// Chapter routes
router.get("/:chapterId", chapterController.getChapterById);
router.put("/:chapterId", chapterController.updateChapterDetails);

module.exports = router;