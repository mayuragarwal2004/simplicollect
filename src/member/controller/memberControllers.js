// controllers/memberControllers.js
const memberModel = require("../model/memberModel");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require('bcrypt');

// Get member details by memberId
const getMemberById = async (req, res) => {
  const { memberId } = req.user;
  console.log(req.user);

  try {
    const member = await memberModel.findMemberById(memberId);
    member.password = undefined;
    if (member) {
      res.json(member);
    } else {
      res.status(404).json({ message: "Member not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addMember = async (req, res) => {
  let membersData = req.body;

  // Ensure membersData is an array
  if (!Array.isArray(membersData)) {
    return res.status(400).json({ message: "Invalid input. Expected an array." });
  }

  console.log(membersData);

  try {
    membersData = await Promise.all(
      membersData.map(async (member) => {
        // Validate required fields
        if (!member.email || !member.firstName || !member.lastName) {
          throw new Error("Email, first name, and last name are required.");
        }

        // Set default role if not provided
        if (!member.role) {
          member.role = "Member";
        }

        // Generate unique member ID
        member.memberId = member.memberId || uuidv4();

        // Hash password if provided
        if (member.password) {
          const hashedPassword = await bcrypt.hash(member.password, 10);
          member.password = hashedPassword;
        }

        return member;
      })
    );

    // Add members to the database
    const result = await memberModel.addMember(membersData);

    res.json({
      message: "Members added successfully",
      memberIds: result.map((r) => r.memberId),
    });
  } catch (error) {
    console.error("Error adding members:", error);
    res.status(500).json({ error: error.message });
  }
};

const memberList = async (req, res) => {
  let { rows = 10, page = 1, searchQuery } = req.query;
  const { chapterId } = req.body;
  if (!chapterId) {
    return res.status(400).json({ message: "Chapter ID is required" });
  }

  try {
    const members = await memberModel.getMembers(chapterId, searchQuery, page, rows);
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllMembersListController = async (req, res) => {
  const { chapterId } = req.query;
  try {
    const members = await memberModel.getAllMembers(chapterId);
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getMemberById,
  addMember,
  memberList,
  getAllMembersListController,
};
