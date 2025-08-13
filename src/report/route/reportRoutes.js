const express = require("express");
const router = express.Router();
const reportController = require("../controller/reportControllers");


// 
router.get("/:chapterId/package-summary", reportController.getPackageSummaryController);
router.get("/:chapterId/member-Total", reportController.getMemberTotalAmountAndDues);

router.get("/:chapterId/member-transactions-report", reportController.getAllMemberTransactionsReportController);
router.post("/:chapterId/member-transactions-report/export", reportController.getAllMemberTransactionsReportControllerExport);

router.get("/:chapterId/receiver-daywise-report", reportController.getReceiverDaywiseReportController);
router.get("/:chapterId/receiver-daywise-json-report", reportController.getReceiverDaywiseJsonReportController);

router.get("/:chapterId/member-ledger", reportController.getMemberLedgerController);
router.get("/:chapterId/member-ledger-json", reportController.getMemberLedgerJSONController);

// Export all members report to Excel (all package parents, each as a sheet)
router.get('/:chapterId/all-members-excel', reportController.exportAllMembersReportsExcelController);

// Total Transactions Report (weekly, monthly, 3monthly, by term)
router.get('/:chapterId/member-payment-summary-report', require('../controller/memberPaymentSummaryReportController').getMemberPaymentSummaryReportController);
router.get("/:chapterId/member-payment-summary-report/export", require('../controller/memberPaymentSummaryReportController').exportMemberPaymentSummaryExcelController);


module.exports = router;