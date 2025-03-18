const express = require("express");
const feeReceiverControllers = require("../controller/feeReceiverControllers");

const router = express.Router();

router.get("/currentReceivers/:chapterId", feeReceiverControllers.getCurrentReceiversController);

router.get("/cash/:chapterId", feeReceiverControllers.getCashReceiversController);
router.post("/cash/:chapterId", feeReceiverControllers.addCashReceiversController);

router.get("/qr/:chapterId", feeReceiverControllers.getQRReceiversController);
router.post("/qr/:chapterId", feeReceiverControllers.addQRReceiversController);

router.get("/amountCollected/:chapterId", feeReceiverControllers.getAmountCollectedController);

module.exports = router;