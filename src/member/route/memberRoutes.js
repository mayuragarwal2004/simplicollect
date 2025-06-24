const express = require("express");
const router = express.Router();
const memberController = require("../controller/memberControllers");

// Member routes
router.get("/me", memberController.getMemberById);

// add members
router.post("/add", memberController.addMember);

// list of paginated members
router.post("/memberList", memberController.memberList);

// get all members
router.get("/all", memberController.getAllMembersListController);


// member list actions
router.post("/balance_update", memberController.updateMemberBalanceController);


module.exports = router;