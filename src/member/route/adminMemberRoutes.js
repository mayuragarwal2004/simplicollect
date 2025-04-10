const express = require("express");
const router = express.Router();
const adminMembersControllers = require("../controller/adminMemberControllers");
const { route } = require("./memberRoutes");

router.get("/getandsearchmembers", adminMembersControllers.getAndSearchMembersController);
router.get("/", adminMembersControllers.getAllMembersController);
router.put("/updatememberdetails/:memberId",adminMembersControllers.updateMemberDetails);
router.put("/updatepassword/:memberId",adminMembersControllers.updatePassword);
// Member routes
router.get("/:memberId", adminMembersControllers.getMemberById);
router.put("/:memberId", adminMembersControllers.updateMemberDetails);
router.post("/", adminMembersControllers.createMember);
router.delete("/:memberId", adminMembersControllers.deleteMember);
//router.patch("/:memberId", adminMembersControllers.updateMemberStatus);

module.exports = router;
