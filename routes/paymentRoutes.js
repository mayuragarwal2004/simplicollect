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
router.delete("/deleteRequest/:packageId", paymentController.deleteRequest);

module.exports = router;