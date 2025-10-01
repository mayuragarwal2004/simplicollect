const express = require("express");
const router = express.Router();
const rightsController = require("../controller/rightsControllers");

router.get("/sidebar", rightsController.getSidebarRightsController);

// Get if a member of a chapter is allowed to approve a payment request of another member
router.get("/anyMemberApprovePayment/:chapterId", rightsController.getApprovePaymentRightsController);

router.get("/anyMemberMaketransaction/:chapterId", rightsController.getMakeTransactionRightsController);

router.get("/changeDate/:chapterId", rightsController.getChangeDateRightsController);

module.exports = router;