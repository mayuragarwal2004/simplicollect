// routes/chapterRoutes.js
const express = require("express");
const router = express.Router();
const adminChapterControllers = require("../controller/adminChapterControllers");

router.get("/", adminChapterControllers.getAllChaptersController);

// Chapter routes
router.get("/:chapterId", adminChapterControllers.getChapterById);
router.put("/:chapterId", adminChapterControllers.updateChapterDetails);
router.post("/", adminChapterControllers.createChapter);
router.delete("/:chapterId", adminChapterControllers.deleteChapter);

module.exports = router;
