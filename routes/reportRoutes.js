const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportControllers");


// 
router.get("/:chapterId/package-summary", reportController.getPackageSummaryController);
router.get("/allMemberReports", reportController.getAllMemberReports);

module.exports = router;