const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportControllers");


// 
router.get("/:chapterId/package-summary", reportController.getPackageSummaryController);

module.exports = router;