const express = require("express");
const router = express.Router();
const reportController = require("../controller/reportControllers");


// 
router.get("/:chapterId/package-summary", reportController.getPackageSummaryController);
router.get("/:chapterId/member-Total", reportController.getMemberTotalAmountAndDues);

router.post("/:chapterId/member-transactions-report", reportController.getAllMemberTransactionsReportController);
router.get("/:chapterId/member-transactions-json-report", reportController.getAllMemberTransactionsJSONReportController);

router.get("/:chapterId/receiver-daywise-report", reportController.getReceiverDaywiseReportController);
router.get("/:chapterId/receiver-daywise-json-report", reportController.getReceiverDaywiseJsonReportController);

router.get("/:chapterId/member-ledger", reportController.getMemberLedgerController);
router.get("/:chapterId/member-ledger-json", reportController.getMemberLedgerJSONController);

// Export all members report to Excel (all package parents, each as a sheet)
router.get('/:chapterId/all-members-excel', require('../controller/reportControllers').exportAllMembersReportsExcelController);

module.exports = router;