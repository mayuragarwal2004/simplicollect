const express = require("express");
const router = express.Router();
const rightsController = require("../controllers/rightsControllers");

router.get("/sidebar", rightsController.getSidebarRightsController);

// Get if a member of a chapter is allowed to approve a payment request of another member
router.get("/anyMemberApprovePayment/:chapterId", rightsController.getApprovePaymentRightsController);

module.exports = router;