const express = require("express");
const router = express.Router();
const adminChapterMemberListControllers = require("../controller/adminChapterMemberListControllers");

// Get all members of a chapter
router.get("/:chapterSlug/members", adminChapterMemberListControllers.getChapterMembers);

// Remove a member (mark as left with leave date)
router.put("/:chapterSlug/members/:userId/remove", adminChapterMemberListControllers.removeChapterMember);

// Delete a member (completely removes all data)
router.delete("/:chapterSlug/members/:userId", adminChapterMemberListControllers.deleteChapterMember);

// Update a member's role
router.put("/:chapterSlug/members/:userId/role", adminChapterMemberListControllers.updateMemberRole);

// Update a member's balance
router.put("/:chapterSlug/members/:userId/balance", adminChapterMemberListControllers.updateMemberBalance);


router.get("/searchmemberstoadd", adminChapterMemberListControllers.searchMemberForChapterToAdd);

router.get("/:chapterSlug/searchmembersforchapter", adminChapterMemberListControllers.getChapterMembers);

router.post("/:chapterSlug/members/:userId/addmember", adminChapterMemberListControllers.addMemberToChapter);

router.get("/all-features", adminChapterMemberListControllers.getAllFeatures);

module.exports = router;

