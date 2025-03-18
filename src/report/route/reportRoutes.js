const express = require("express");
const router = express.Router();
const reportController = require("../controller/reportControllers");


// 
router.get("/:chapterId/package-summary", reportController.getPackageSummaryController);
router.get("/:chapterId/member-transactions", reportController.getAllMemberReports);
router.get("/:chapterId/member-Total", reportController.getMemberTotalAmountAndDues);

router.get("/:chapterId/receiver-daywise-report", reportController.getReceiverDaywiseReportController);

module.exports = router;