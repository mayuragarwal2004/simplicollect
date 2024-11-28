const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberControllers");

// Member routes
router.get("/me", memberController.getMemberById);

// add members
router.post("/addMember", memberController.addMember);

// list of all members
router.post("/memberList", memberController.memberList);

module.exports = router;