
const adminMembersModel = require("../model/adminMembersModel");

const getMemberById = async (req, res) => {
  const { memberId } = req.params;
  try {
    const member = await adminMembersModel.findMemberById(memberId);
    if (member) {
      res.json(member);
    } else {
      res.status(404).json({ message: "Member not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const updateMemberDetails = async (req, res) => {
  const { memberId } = req.params;
  const updatedDetails = req.body;
  try {
    const updatedMember = await adminMembersModel.updateMember(memberId, updatedDetails);
    if (updatedMember) {
      res.json(updatedMember);
    } else {
      res.status(404).json({ message: "Member not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getAllMembersController = async (req, res) => {
  const { memberId } = req.user;
  try {
    console.log({memberId});
    
    const members = await adminMembersModel.getAllMembers(memberId);
    res.json(members);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

const createMember = async (req, res) => {
  try {
    const memberData = req.body;
    
    // Validate required fields
    if (!memberData.memberName || !memberData.email || !memberData.phoneNumber) {
      return res.status(400).json({ error: "All fields are required" });
  }
  
    
    // Create the member
    const newMember = await adminMembersModel.createMember(memberData); // Update to createMember
    
    res.status(201).json(newMember);
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    
    const member = await adminMembersModel.getMemberById(memberId);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    
    await adminMembersModel.deleteMember(memberId);
    res.json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ error: error.message });
  }
};

const getAndSearchMembersController = async (req, res) => {
  const { searchQuery = "" } = req.query;
  let { rows = 10, page = 1 } = req.query;
  console.log("searchQuery is ", searchQuery);
  rows = parseInt(rows, 10);
  page = parseInt(page, 10);

  try {
    const { members, total } = await adminMembersModel.getAndSearchMembersController(searchQuery, rows, page);

    res.json({
      data:members,
      totalRecords: total,
      rows,
      page
    });
  } catch (error) {
    console.error("Error searching for members:", error);
    res.status(500).json({ error: error.message });
  }
};

const changeUserDetails = async (req, res) => {
  const { memberId, firstName,lastName, phoneNumber, email } = req.body;

  // Validate required fields
  if (!memberId || !firstName || !lastName || !phoneNumber || !email) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if the member exists
    const existingMember = await adminMembersModel.findMemberById(memberId);
    if (!existingMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Update member details
    const updatedMember = await adminMembersModel.updateMember(memberId, {
      firstName,
      lastName,
      phoneNumber,
      email,
    });

    res.json(updatedMember);
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getMemberById,
  updateMemberDetails,
  getAllMembersController,
  deleteMember,
  createMember,
  getAndSearchMembersController,
  changeUserDetails
};