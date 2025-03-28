const express = require("express");
const router = express.Router();
const adminMembersControllers = require("../controller/adminMemberControllers");

router.get("/", adminMembersControllers.getAllMembersController);

// Member routes
router.get("/:memberId", adminMembersControllers.getMemberById);
router.put("/:memberId", adminMembersControllers.updateMemberDetails);
router.post("/", adminMembersControllers.createMember);
router.delete("/:memberId", adminMembersControllers.deleteMember);
router.patch("/:memberId", adminMembersControllers.updateMemberStatus);

module.exports = router;
