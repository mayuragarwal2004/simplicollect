const express = require("express");
const feeRecieverController = require("../controllers/feeRecieverController");

const router = express.Router();

router.get("/cash/:chapterId", feeRecieverController.getCashReceiversController);
router.post("/cash/:chapterId", feeRecieverController.addCashReceiverController);

router.get("/qr/:chapterId", feeRecieverController.getQrReceiversController);
router.post("/qr/:chapterId", feeRecieverController.addQrReceiverController);

module.exports = router; 