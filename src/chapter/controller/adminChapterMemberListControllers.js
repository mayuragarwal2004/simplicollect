const adminChapterMemberListModel = require("../model/adminChapterMemberListModel");

// Get all members of a chapter by chapterSlug
const getChapterMembers = async (req, res) => {
  const { searchQuery = ""} = req.query;
  const { chapterSlug } = req.params;
  let {  rows = 10, page = 1 } = req.query;
  if (!chapterSlug) {
    return res.status(400).json({ error: "Chapter slug is required" });
  }
  
  rows = parseInt(rows, 10);
  page = parseInt(page, 10);

  try {
    const { members, total } = await adminChapterMemberListModel.getChapterMembers(searchQuery,chapterSlug, rows, page);
    
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

const searchMemberForChapterToAdd = async (req, res) => {
  const { searchQuery, chapterSlug } = req.query;
  if (!searchQuery || !chapterSlug) {
    return res.status(400).json({ message: "Search query and chapterSlug are required." });
  }
  try {
    const members = await adminChapterMemberListModel.searchMemberForChapterToAdd(searchQuery, chapterSlug);
    if (members.length > 0) {
      res.json(members);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.error("Error searching for members:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const addMemberToChapter=async (req, res) => {
  const { chapterSlug, userId } = req.params;
  console.log("Adding member to chapter:", chapterSlug, userId);
  
  const { role="member" } = req.body;

  if (!userId || !role) {
    return res.status(400).json({ error: "User ID and role are required" });
  }

  try {
    const addedMember = await adminChapterMemberListModel.addMemberToChapter(chapterSlug, userId, role);
    res.json({ message: "Member added successfully", addedMember });
  } catch (error) {
    console.error("Error adding member to chapter:", error);
    res.status(500).json({ error: error.message });
  }
}

const searchMemberForChapter = async (req, res) => {
  const { searchQuery, chapterId } = req.query;
  if (!searchQuery || !chapterId) {
    return res.status(400).json({ message: "Search query and chapterId are required." });
  }

  let { rows = 10, page = 1 } = req.query;
  rows = parseInt(rows, 10);
  page = parseInt(page, 10);

  try {
    const { members, total } = await adminChapterMemberListModel.searchMemberForChapter(
      searchQuery,
      chapterId,
      rows,
      page
    );

    res.json({
      data: members,
      totalRecords: total,
      rows,
      page
    });
  } catch (error) {
    console.error("Error searching for members:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllFeatures = async (req, res) => {
  try {
    const features = await adminChapterMemberListModel.getAllFeatures();
    res.json(features);
  } catch (error) {
    console.error("Error fetching all features:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  getChapterMembers,
  removeChapterMember,
  deleteChapterMember,
  updateMemberRole,
  updateMemberBalance,
  searchMemberForChapterToAdd,
  searchMemberForChapter,
  addMemberToChapter,
  getAllFeatures,
};
