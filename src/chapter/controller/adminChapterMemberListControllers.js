const adminChapterMemberListModel = require("../model/adminChapterMemberListModel");

// Get all members of a chapter by chapterSlug
const getChapterMembers = async (req, res) => {
  const { chapterSlug } = req.params;
  let { rows = 10, page = 1 } = req.query;

  rows = parseInt(rows, 10);
  page = parseInt(page, 10);

  try {
    const { members, total } = await adminChapterMemberListModel.getChapterMembers(chapterSlug, rows, page);
    
    res.json({
      data:members,
      totalRecords: total,
      rows,
      page
    });
  } catch (error) {
    console.error("Error fetching chapter members:", error);
    res.status(500).json({ error: error.message });
  }
};

// Remove a member (mark as left)
const removeChapterMember = async (req, res) => {
  const { chapterSlug, userId } = req.params;
  const { leaveDate } = req.body;

  if (!leaveDate) {
    return res.status(400).json({ error: "Leave date is required" });
  }

  try {
    const removedMember = await adminChapterMemberListModel.removeChapterMember(chapterSlug, userId, leaveDate);
    res.json({ message: "Member removed successfully", removedMember });
  } catch (error) {
    console.error("Error removing chapter member:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a member completely (wrong entry)
const deleteChapterMember = async (req, res) => {
  const { chapterSlug, userId } = req.params;

  try {
    const deletedMember = await adminChapterMemberListModel.deleteChapterMember(chapterSlug, userId);
    res.json({ message: "Member deleted successfully", deletedMember });
  } catch (error) {
    console.error("Error deleting chapter member:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update a member's role
const updateMemberRole = async (req, res) => {
  const { chapterSlug, userId } = req.params;
  const { role } = req.body;
  if (!role) {
    return res.status(400).json({ error: "Role is required" });
  }

  try {
    const updatedMember = await adminChapterMemberListModel.updateMemberRole(chapterSlug, userId, role);
    res.json({ message: "Role updated successfully", updatedMember });
  } catch (error) {
    console.error("Error updating member role:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update a member's balance
const updateMemberBalance = async (req, res) => {
  const { chapterSlug, userId } = req.params;
  const { balance, addToTransaction } = req.body;
  const { memberId } = req.user;
  if (balance === undefined) {
    return res.status(400).json({ error: "Balance amount is required" });
  }

  try {
    const updatedBalance = await adminChapterMemberListModel.updateMemberBalance(chapterSlug, userId, balance, addToTransaction,memberId);
    res.json({ message: "Balance updated successfully", updatedBalance });
  } catch (error) {
    console.error("Error updating member balance:", error);
    res.status(500).json({ error: error.message });
  }
};

const searchMemberForChapter = async (req, res) => {
  const { searchQuery, chapterId } = req.query;
  if (!searchQuery || !chapterId) {
    return res.status(400).json({ message: "Search query and chapterId are required." });
  }

  try {
    const members = await adminChapterMemberListModel.searchMemberForChapter(searchQuery, chapterId);
    if (members.length > 0) {
      res.json(members);
    } else {
      res.status(404).json({ message: "No matching members found." });
    }
  } catch (error) {
    console.error("Error searching for members:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getChapterMembers,
  removeChapterMember,
  deleteChapterMember,
  updateMemberRole,
  updateMemberBalance,
  searchMemberForChapter
};
