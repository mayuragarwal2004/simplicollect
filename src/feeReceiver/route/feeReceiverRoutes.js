const express = require("express");
const feeReceiverControllers = require("../controller/feeReceiverControllers");

const router = express.Router();

router.get("/currentReceivers/:chapterId", feeReceiverControllers.getCurrentReceiversController);

router.get("/cash/:chapterId", feeReceiverControllers.getCashReceiversController);
router.post("/cash/:chapterId", feeReceiverControllers.addCashReceiversController);
router.delete("/cash/:chapterId/:receiverId", feeReceiverControllers.deleteCashReceiversController);
router.put("/cash/:chapterId/:receiverId", feeReceiverControllers.updateCashReceiversController);

router.get("/qr/:chapterId", feeReceiverControllers.getQRReceiversController);
router.post("/qr/:chapterId", feeReceiverControllers.addQRReceiversController);
router.delete("/qr/:chapterId/:receiverId", feeReceiverControllers.deleteQRReceiversController);
router.get("/amountCollected/:chapterId", feeReceiverControllers.getAmountCollectedController);
router.put("/qr/:chapterId/:receiverId", feeReceiverControllers.updateQRReceiversController);

module.exports = router;