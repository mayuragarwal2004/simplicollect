const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportControllers");


// 
router.get("/:chapterId/package-summary", reportController.getPackageSummaryController);
router.get("/:chapterId/member-transactions", reportController.getAllMemberReports);
router.get("/:chapterId/member-Total", reportController.getMemberTotalAmountAndDues);

module.exports = router;