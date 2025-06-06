const db = require("../../config/db");

// Function to find a member by its ID
const findMemberById = async (memberId) => {
  return db("members") // Update to "members" table
    .where("memberId", memberId) // Update to "memberId"
    .first();
};

// Function to update member details
const updateMember = async (memberId, memberData) => {
  return db("members")
    .where("memberId", memberId)
    .update(memberData)
    .returning("*");
};

// Function to get all members (admin has access to all)
const getAllMembers = async (rows, page) => {
  return db("members")
    .orderBy("memberName", "asc")
    .limit(rows)
    .offset(page * rows);
};

// Function to create a new member
const createMember = async (memberData) => {
  return db("members").insert(memberData).returning("*");
};

// Function to delete a member by its ID
const deleteMember = async (memberId) => {
  return db("members").where("memberId", memberId).del();
};

const getAndSearchMembersController = async (
  searchQuery = "",
  rows = 10,
  page = 1
) => {
  if (isNaN(rows) || rows < 1) rows = 10;
  if (isNaN(page) || page < 1) page = 1;

  const offset = (page - 1) * rows;

  try {
    let query = db("members");

    if (searchQuery.trim() !== "") {
      const searchPattern = `%${searchQuery.toLowerCase()}%`;

      query = query.where(function () {
        this.whereRaw("LOWER(CONCAT(firstName, ' ', lastName)) LIKE ?", [
          searchPattern,
        ])
          .orWhereRaw("LOWER(email) LIKE ?", [searchPattern])
          .orWhereRaw("LOWER(phoneNumber) LIKE ?", [searchPattern]);
      });
    }

    const totalResult = await query.clone().count("* as count").first();

    const members = await query
      .clone()
      .select(
        "members.*",
        db.raw("COUNT(member_chapter_mapping.chapterId) as numberOfChapter")
      )
      .leftJoin(
        "member_chapter_mapping",
        "members.memberId",
        "member_chapter_mapping.memberId"
      )
      .leftJoin(
        "chapters",
        "member_chapter_mapping.chapterId",
        "chapters.chapterId"
      )
      .groupBy("members.memberId")
      .orderByRaw("LOWER(CONCAT(firstName, ' ', lastName)) ASC")
      .limit(rows)
      .offset(offset);

    return {
      members,
      total: totalResult?.count || 0,
    };
  } catch (err) {
    console.error("🔥 REAL ERROR:", err.message);
    throw err;
  }
};

module.exports = {
  findMemberById,
  updateMember,
  getAllMembers,
  createMember,
  deleteMember,
  getAndSearchMembersController,
};
