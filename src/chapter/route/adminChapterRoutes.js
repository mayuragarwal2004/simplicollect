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

router.get("/:chapterSlug/roles", adminChapterControllers.getRolesByChapterSlug);
router.post("/:chapterSlug/addRole", adminChapterControllers.addRole);
router.put("/:chapterSlug/editRole/:roleId", adminChapterControllers.editRole);
router.delete("/:chapterSlug/deleteRole/:roleId", adminChapterControllers.deleteRole);

module.exports = router;
