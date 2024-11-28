// controllers/memberControllers.js
const memberModel = require("../models/memberModel");
const { v4: uuidv4 } = require("uuid");

// Get member details by memberId
const getMemberById = async (req, res) => {
  const { memberId } = req.user;
  console.log(req.user);

  try {
    const member = await memberModel.findMemberById(memberId);
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
  const membersData = req.body;
  console.log(membersData);

  membersData.filter((member) => {
    return !member.memberId;
  });

  membersData.forEach((member) => {
    if (!member.email || !member.firstName || !member.lastName) {
      return res.status(400).json({ message: "Email and name are required" });
    }
    if (!member.role) {
      member.role = "Member";
    }
    member.memberId = uuidv4();
  });

  try {
    const result = await memberModel.addMember(membersData);
    res.json({ message: "Member added successfully", memberId: result[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const memberList = async (req, res) => {
  const { chapterId } = req.body;
  if (!chapterId) {
    return res.status(400).json({ message: "Chapter ID is required" });
  }

  try {
    const members = await memberModel.getMembers(chapterId);
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getMemberById,
  addMember,
  memberList,
};
