const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Route to add a new payment
router.post("/addPayment", paymentController.addPayment);

// Route to get all payments
// router.get("/allPayments", paymentController.allPayments);

// Route to get all pending payments
router.get("/pendingPayments", paymentController.checkPendingPayments);

// delete pending payment request
router.delete("/deleteRequest/:transactionId", paymentController.deleteRequest);

// Get pending payments of the chapter
router.get("/pendingPayments/:chapterId", paymentController.chapterPendingPayments);

// Approve Payment
router.put("/approvePendingPayment", paymentController.approvePendingPaymentController);

module.exports = router;