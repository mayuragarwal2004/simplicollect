// controllers/memberControllers.js
const memberModel = require("../model/memberModel");
const chapterModel = require("../../chapter/model/chapterModel");
const memberService = require("../service/memberService");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

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

  try {
    const results = [];
    for (const member of membersData) {
      // Must have chapterId and joinDate
      if (!member.chapterId || !member.joinDate) {
        results.push({ error: "chapterId and joinDate are required", member });
        continue;
      }
      // Fetch default roles for the chapter
      const defaultRoleIds = await chapterModel.getDefaultRoleIdsForChapter(member.chapterId);
      const roleIdsStr = defaultRoleIds.join(",");
      // Check for existing by email or phone
      let existing = null;
      if (member.email) existing = await memberModel.findMemberByEmail(member.email);
      if (!existing && member.phoneNumber) existing = await memberModel.findMemberByPhone(member.phoneNumber);
      console.log("Existing member found:", existing);
      
      if (existing) {
        // Check mapping
        const mapping = await memberModel.getMemberChapterMapping(existing.memberId, member.chapterId);
        if (mapping && mapping.status === "joined") {
          results.push({ error: "Member already in chapter", memberId: existing.memberId });
          continue;
        } else if (mapping && mapping.status === "left") {
          await memberModel.addOrUpdateMemberChapterMappingWithRoles(existing.memberId, member.chapterId, member.joinDate, roleIdsStr);
          results.push({ message: "Member re-joined chapter", memberId: existing.memberId });
          continue;
        } else {
          await memberModel.addOrUpdateMemberChapterMappingWithRoles(existing.memberId, member.chapterId, member.joinDate, roleIdsStr);
          results.push({ message: "Member added to chapter", memberId: existing.memberId });
          continue;
        }
      } else {
        // New member: check for required fields
        if (!member.firstName || (!member.email && !member.phoneNumber)) {
          results.push({ error: "First name and either email or phone number required", member });
          continue;
        }
        // Check for duplicate email/phone
        if (member.email) {
          const emailExists = await memberModel.findMemberByEmail(member.email);
          if (emailExists) {
            results.push({ error: "Email already exists", email: member.email });
            continue;
          }
        }
        if (member.phoneNumber) {
          const phoneExists = await memberModel.findMemberByPhone(member.phoneNumber);
          if (phoneExists) {
            results.push({ error: "Phone number already exists", phoneNumber: member.phoneNumber });
            continue;
          }
        }
        // Create new member
        const newMemberId = uuidv4();
        let password = member.password;
        if (password) password = await bcrypt.hash(password, 10);
        await memberModel.addMember({
          memberId: newMemberId,
          firstName: member.firstName,
          lastName: member.lastName || null,
          email: member.email || null,
          phoneNumber: member.phoneNumber || null,
          password,
        });
        await memberModel.addOrUpdateMemberChapterMappingWithRoles(newMemberId, member.chapterId, member.joinDate, roleIdsStr);
        results.push({ message: "New member created and added to chapter", memberId: newMemberId });
      }
    }
    res.json({ results });
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
    const members = await memberModel.getMembers(
      chapterId,
      searchQuery,
      page,
      rows
    );
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
};

const updateMemberBalanceController = async (req, res) => {
  const { memberId: currentUserMemberId } = req.user;
  const { memberId: bodyMemberId, newBalance, reason, chapterId } = req.body;

  const currentUser = await memberModel.findMemberById(currentUserMemberId);
  if (!currentUser) {
    return res.status(404).json({ message: "Current user not found" });
  }

  const bodyMember = await memberModel.findMemberById(bodyMemberId);
  if (!bodyMember) {
    return res.status(404).json({ message: "Member to update not found" });
  }

  if (!chapterId) {
    return res.status(400).json({ message: "Chapter ID is required" });
  }

  try {
    const updatedMember = await memberService.updateMemberBalanceService(
      bodyMember,
      chapterId,
      newBalance,
      reason,
      currentUser,
    );
    res.json(updatedMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMemberRoleController = async (req, res) => {
  const { memberId: currentUserMemberId } = req.user;
  const { memberId: bodyMemberId, roleIds, chapterId } = req.body;
  const currentUser = await memberModel.findMemberById(currentUserMemberId);
  if (!currentUser) {
    return res.status(404).json({ message: "Current user not found" });
  }
  const bodyMember = await memberModel.findMemberById(bodyMemberId);
  if (!bodyMember) {
    return res.status(404).json({ message: "Member to update not found" });
  }
  const chapter = await chapterModel.findChapterById(chapterId);
  if (!chapter) {
    return res.status(404).json({ message: "Chapter not found" });
  }

  try {
    const updatedMember = await memberService.updateMemberRoleService(
      bodyMember,
      chapter,
      roleIds,
      currentUser,
    );
    res.json(updatedMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeMemberController = async (req, res) => {
  const { memberId: currentUserMemberId } = req.user;
  const { memberId: bodyMemberId, chapterId, leaveDate } = req.body;

  try {
    const result = await memberService.removeMemberService(
      bodyMemberId,
      chapterId,
      leaveDate
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search members by email, phone, or name
const searchMembersController = async (req, res) => {
  const { query } = req.query;
  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Query is required" });
  }
  try {
    const members = await memberModel.searchMembers(query);
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getMemberById,
  addMember,
  memberList,
  getAllMembersListController,
  updateMemberBalanceController,
  updateMemberRoleController,
  removeMemberController,
  searchMembersController,
};
