const express = require("express");
const router = express.Router();
const chapterPaymentController = require("../controller/chapterPaymentController");

router.get(
  "/:chapterId/approved-transactions",
  chapterPaymentController.getApprovedTransactionsController
);

router.post(
  "/:chapterId/pay-to-chapter",
  chapterPaymentController.payToChapterController
);

router.get(
  "/:chapterId/chapter-transactions",
  chapterPaymentController.getChapterTransactionsController
);

router.get(
  "/:chapterId/pending-transactions",
  chapterPaymentController.getPendingTransactionsController
);

router.post(
  "/approve-payment/:transactionId",
  chapterPaymentController.approvePaymentController
);

module.exports = router;
