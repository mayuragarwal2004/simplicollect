const adminChapterMemberListModel = require("../model/adminChapterMemberListModel");

// Get all members of a chapter by chapterSlug
const getChapterMembers = async (req, res) => {
  const { chapterSlug } = req.params;
  try {
    const members = await adminChapterMemberListModel.getChapterMembers(chapterSlug);
    res.json(members);
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
    const removedMember = await adminChapterMemberListModel.removeMember(chapterSlug, userId, leaveDate);
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
    const deletedMember = await adminChapterMemberListModel.deleteMember(chapterSlug, userId);
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
    const updatedMember = await adminChapterMemberListModel.updateRole(chapterSlug, userId, role);
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

  if (balance === undefined) {
    return res.status(400).json({ error: "Balance amount is required" });
  }

  try {
    const updatedBalance = await adminChapterMemberListModel.updateBalance(chapterSlug, userId, balance, addToTransaction);
    res.json({ message: "Balance updated successfully", updatedBalance });
  } catch (error) {
    console.error("Error updating member balance:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getChapterMembers,
  removeChapterMember,
  deleteChapterMember,
  updateMemberRole,
  updateMemberBalance,
};
