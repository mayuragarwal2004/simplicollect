const express = require("express");
const feeReceiverControllers = require("../controller/feeReceiverControllers");

const router = express.Router();

router.get("/cash/:chapterId", feeReceiverControllers.getCashReceiversController);
router.post("/cash/:chapterId", feeReceiverControllers.addCashReceiversController);
router.get("/currentCashReceivers/:chapterId", feeReceiverControllers.getCurrentCashReceiversController);

router.get("/qr/:chapterId", feeReceiverControllers.getQRReceiversController);
router.post("/qr/:chapterId", feeReceiverControllers.addQRReceiversController);
router.get("/currentQRReceivers/:chapterId", feeReceiverControllers.getCurrentQRReceiversController);

router.get("/amountCollected/:chapterId", feeReceiverControllers.getAmountCollectedController);

module.exports = router;