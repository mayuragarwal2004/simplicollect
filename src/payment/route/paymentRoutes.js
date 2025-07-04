const express = require("express");
const router = express.Router();
const paymentController = require("../controller/paymentController");

// Route to add a new payment
router.post("/addPayment", paymentController.addPayment);

// Route to get all payments
// router.get("/allPayments", paymentController.allPayments);

// Route to get a member's all pending payments
router.get("/pendingPayments", paymentController.checkPendingPayments);

// delete pending payment request
router.delete("/deleteRequest/:transactionId", paymentController.deleteRequest);

// Get pending payments of the chapter
router.get("/pendingPayments/:chapterId", paymentController.chapterPendingPayments);

// Approve Payment
router.put("/approvePendingPayment", paymentController.approvePendingPaymentController);

// Move approved payment back to pending
router.put("/moveApprovedToPending", paymentController.moveApprovedToPendingController);

// Route to get all payment requests of a member
router.post("/paymentRequests/:chapterId", paymentController.getPaymentRequestsController);

// Route to get the balance of a member of a chapter
router.get("/balance/:chapterId", paymentController.getMemberChapterBalancesController);

// Route to get meta data
router.get("/metaData/:chapterId", paymentController.getMetaDataController);

// Save edited fee details without changing status
router.put("/saveEditedFeeDetails", paymentController.saveEditedFeeDetailsController);

module.exports = router;