// routes/chapterRoutes.js
const express = require("express");
const router = express.Router();
const chapterController = require("../controller/chapterControllers");

router.get("/", chapterController.getAllChaptersController);

// Chapter routes
router.get("/:chapterId", chapterController.getChapterById);
router.put("/:chapterId", chapterController.updateChapterDetails);

router.get("/:chapterSlug/roles", chapterController.getRolesByChapterSlugController);

module.exports = router;