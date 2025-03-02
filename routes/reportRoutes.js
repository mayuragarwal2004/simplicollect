const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportControllers");


// 
router.get("/:chapterId/package-summary", reportController.getPackageSummaryController);
router.get("/member-transactions", reportController.getAllMemberReports);
router.get("/member-Total", reportController.getMemberTotalDues);

module.exports = router;