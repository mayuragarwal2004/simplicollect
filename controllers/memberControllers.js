// controllers/memberControllers.js
const memberModel = require("../models/memberModel");

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

module.exports = {
  getMemberById,
};
