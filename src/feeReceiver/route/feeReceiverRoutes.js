const express = require("express");
const feeReceiverControllers = require("../controller/feeReceiverControllers");

const router = express.Router();

// Unified fee receiver routes
router.get("/current/:chapterId", feeReceiverControllers.getCurrentReceiversController);
router.get("/:chapterId", feeReceiverControllers.getAllReceiversController);
router.post("/:chapterId", feeReceiverControllers.addReceiverController);
router.put("/:chapterId/:receiverId", feeReceiverControllers.updateReceiverController);
router.delete("/:chapterId/:receiverId", feeReceiverControllers.deleteReceiverController);
router.get("/amount-collected/:chapterId", feeReceiverControllers.getAmountCollectedController);

// Legacy routes for backward compatibility (optional - can be removed later)
router.get("/cash/:chapterId", feeReceiverControllers.getCashReceiversController);
router.get("/qr/:chapterId", feeReceiverControllers.getQRReceiversController);

module.exports = router;