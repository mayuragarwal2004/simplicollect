// models/memberModel.js
const db = require("../../config/db");

// Function to find a member by email
const findMemberByEmail = async (email) => {
  return db("members").where("email", email).first();
};

// Function to find a member by ID
const findMemberById = async (memberId) => {
  return db("members").where("memberId", memberId).first();
};

// Add member
const addMember = async (memberData) => {
  return db("members").insert(memberData);
  db("memberschaptermapping").insert({
    memberId: memberData.memberId,
    chapterId: memberData.chapterId,
  });
};

const getMembers = async (chapterId, searchQuery = "", page = 0, rows = 10) => {
  const offset = parseInt(page, 10) * parseInt(rows, 10);

  let baseQuery = db("member_chapter_mapping as mmm")
    .where("mmm.chapterId", chapterId)
    .join("members as m", "mmm.memberId", "m.memberId")
    .joinRaw("JOIN roles as r ON FIND_IN_SET(r.roleId, mmm.roleIds) > 0");

  if (searchQuery) {
    baseQuery = baseQuery.where((qb) => {
      qb.where("m.firstName", "like", `%${searchQuery}%`)
        .orWhere("m.lastName", "like", `%${searchQuery}%`)
        .orWhere(
          db.raw("CONCAT(m.firstName, ' ', m.lastName)"),
          "like",
          `%${searchQuery}%`
        )
        .orWhere("m.email", "like", `%${searchQuery}%`)
        .orWhere("m.phoneNumber", "like", `%${searchQuery}%`)
        .orWhere("r.roleName", "like", `%${searchQuery}%`);
    });
  }

  const data = await baseQuery
    .select(
      "m.memberId",
      "m.firstName",
      "m.lastName",
      "m.phoneNumber",
      "m.email",
      "mmm.*",
      db.raw(
        "GROUP_CONCAT(DISTINCT r.roleName ORDER BY r.roleName ASC SEPARATOR ', ') as roleNames"
      ),
      db.raw("CONCAT(m.firstName, ' ', m.lastName) as fullName")
    )
    .groupBy("m.memberId") // Ensure one row per member
    .limit(rows)
    .offset(offset);

  // Fetch total count (without pagination)
  const totalRecordsQuery = db("member_chapter_mapping as mmm")
    .where("mmm.chapterId", chapterId)
    .join("members as m", "mmm.memberId", "m.memberId")
    .joinRaw("JOIN roles as r ON FIND_IN_SET(r.roleId, mmm.roleIds) > 0");

  if (searchQuery) {
    totalRecordsQuery.where((qb) => {
      qb.where("m.firstName", "like", `%${searchQuery}%`)
        .orWhere("m.lastName", "like", `%${searchQuery}%`)
        .orWhere(
          db.raw("CONCAT(m.firstName, ' ', m.lastName)"),
          "like",
          `%${searchQuery}%`
        )
        .orWhere("m.email", "like", `%${searchQuery}%`)
        .orWhere("m.phoneNumber", "like", `%${searchQuery}%`)
        .orWhere("r.roleName", "like", `%${searchQuery}%`);
    });
  }

  const totalRecords = await totalRecordsQuery
    .countDistinct("m.memberId as totalRecords")
    .first();

  return { data, totalRecords: totalRecords.totalRecords };
};

const getAllMembers = async (chapterId) => {
  return db("member_chapter_mapping as mmm")
    .where("mmm.chapterId", chapterId)
    .join("members as m", "mmm.memberId", "m.memberId")
    .joinRaw("JOIN roles as r ON FIND_IN_SET(r.roleId, mmm.roleIds) > 0")
    .select(
      "m.memberId",
      "m.firstName",
      "m.lastName",
      "m.phoneNumber",
      "m.email",
      "mmm.*",
      db.raw("CONCAT(m.firstName, ' ', m.lastName) as label"),
      db.raw(
        "GROUP_CONCAT(DISTINCT r.roleName ORDER BY r.roleName ASC SEPARATOR ', ') as roleNames"
      )
    )
    .groupBy("m.memberId")
    .orderBy("label", "asc");
};

const updateMemberBalance = async (member, chapterId, balance, trx = null) => {
  let query = db("member_chapter_mapping")
    .where("memberId", member.memberId)
    .where("chapterId", chapterId)
    .update({ balance });
  if (trx) query = query.transacting(trx);
  await query;
  let memberQuery = db("members").where("memberId", member.memberId).first();
  if (trx) memberQuery = memberQuery.transacting(trx);
  return memberQuery;
};

const updateMemberRoleModel = async (member, chapter, roleIds, trx = null) => {
  console.log("Updating member role model:", {
    memberId: member.memberId,
    chapterId: chapter.chapterId,
    roleIds,
  });
  
  let query = db("member_chapter_mapping")
    .where("memberId", member.memberId)
    .where("chapterId", chapter.chapterId)
    .update({ roleIds: roleIds.join(",") });
  if (trx) query = query.transacting(trx);
  await query;
  return db("member_chapter_mapping")
    .where("memberId", member.memberId)
    .where("chapterId", chapter.chapterId)
    .first();
};

module.exports = {
  findMemberByEmail,
  findMemberById,
  addMember,
  getMembers,
  getAllMembers,
  updateMemberBalance,
  updateMemberRoleModel,
};
