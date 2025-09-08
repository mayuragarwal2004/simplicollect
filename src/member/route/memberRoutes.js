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

// Search members (all, by email/phone/name)
router.get("/search", memberController.searchMembersController);

// Search members by chapter - more specific route
router.get("/search/chapter/:chapterSlug", memberController.searchMembersByChapterController);

// member list actions
router.post("/balance_update", memberController.updateMemberBalanceController);

router.post("/role_update", memberController.updateMemberRoleController);

// remove member
router.post("/remove", memberController.removeMemberController);

module.exports = router;