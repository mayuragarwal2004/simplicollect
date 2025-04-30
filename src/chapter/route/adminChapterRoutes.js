// routes/chapterRoutes.js
const express = require("express");
const router = express.Router();
const adminChapterControllers = require("../controller/adminChapterControllers");
const verifyBulkMiddleware = require("../../middlewares/verifyBulk.middleware");

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


const multer = require("multer");

// Multer configuration
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });
router.post("/add-bulk-members", upload.single("excelFile"),verifyBulkMiddleware, adminChapterControllers.checkAndSaveMembers);
router.post("/check-format",upload.single("excelFile"),verifyBulkMiddleware, adminChapterControllers.checkFormatAndReturnExcel);

module.exports = router;
