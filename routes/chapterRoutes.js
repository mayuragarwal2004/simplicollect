// routes/chapterRoutes.js
const express = require("express");
const router = express.Router();
const chapterController = require("../controllers/chapterControllers");

// Chapter routes
router.get("/:chapterId", chapterController.getChapterById);

module.exports = router;