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

  // Helper to build the base query with optional search
  const buildBaseQuery = () => {
    let query = db("member_chapter_mapping as mmm")
      .where("mmm.chapterId", chapterId)
      .join("members as m", "mmm.memberId", "m.memberId")
      .where("mmm.status", "joined")
      .leftJoin("roles as r", function () {
        this.on(db.raw("FIND_IN_SET(r.roleId, mmm.roleIds) > 0"));
      });

    if (searchQuery) {
      query = query.where((qb) => {
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
    return query;
  };

  // Data query
  const data = await buildBaseQuery()
    .select(
      "m.memberId",
      "m.firstName",
      "m.lastName",
      "m.phoneNumber",
      "m.email",
      "mmm.*",
      db.raw(
        `CASE 
          WHEN mmm.roleIds IS NULL OR mmm.roleIds = '' 
          THEN NULL 
          ELSE GROUP_CONCAT(DISTINCT r.roleName ORDER BY r.roleName ASC SEPARATOR ', ') 
        END as roleNames`
      ),
      db.raw("CONCAT(m.firstName, ' ', m.lastName) as fullName")
    )
    .groupBy("m.memberId")
    .limit(rows)
    .offset(offset);

  // Total count query
  const totalRecordsResult = await buildBaseQuery()
    .countDistinct("m.memberId as totalRecords")
    .first();

  return { data, totalRecords: totalRecordsResult.totalRecords };
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
    .where("mmm.status", "joined")
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

const removeMemberFromChapter = async (memberId, chapterId, leaveDate) => {
  return db("member_chapter_mapping")
    .where({ memberId, chapterId })
    .update({ status: "left", leaveDate });
};

// Search members by email, phone, or name (across all chapters)
const searchMembers = async (query) => {
  return db("members")
    .where(function () {
      this.where("email", "like", `%${query}%`)
        .orWhere("phoneNumber", "like", `%${query}%`)
        .orWhere("firstName", "like", `%${query}%`)
        .orWhere("lastName", "like", `%${query}%`)
        .orWhere(db.raw("CONCAT(firstName, ' ', lastName) like ?", [`%${query}%`]));
    })
    .select(
      "memberId",
      "firstName",
      "lastName",
      "email",
      "phoneNumber"
    );
};

// Search members by chapter with optional cluster filtering
const searchMembersByChapter = async (chapterId, query = "", includeWithoutCluster = false) => {
  let dbQuery = db("members as m")
    .join("member_chapter_mapping as mcm", "m.memberId", "mcm.memberId")
    .leftJoin("clusters as c", "mcm.clusterId", "c.clusterId")
    .where({
      "mcm.chapterId": chapterId,
      "mcm.status": "joined"
    });

  if (query.trim() !== "") {
    dbQuery = dbQuery.where(function () {
      this.where("m.email", "like", `%${query}%`)
        .orWhere("m.phoneNumber", "like", `%${query}%`)
        .orWhere("m.firstName", "like", `%${query}%`)
        .orWhere("m.lastName", "like", `%${query}%`)
        .orWhere(db.raw("CONCAT(m.firstName, ' ', m.lastName) like ?", [`%${query}%`]));
    });
  }

  return dbQuery.select(
    "m.memberId",
    "m.firstName",
    "m.lastName",
    "m.email",
    "m.phoneNumber",
    "mcm.clusterId",
    "c.clusterName",
    db.raw("CONCAT(m.firstName, ' ', m.lastName) as name"),
    db.raw("m.phoneNumber as phone")
  );
};

// Find member by phone number
const findMemberByPhone = async (phoneNumber) => {
  return db("members").where("phoneNumber", phoneNumber).first();
};

// Get member-chapter mapping
const getMemberChapterMapping = async (memberId, chapterId) => {
  return db("member_chapter_mapping")
    .where({ memberId, chapterId })
    .first();
};

// Add or update member-chapter mapping
const addOrUpdateMemberChapterMapping = async (memberId, chapterId, joinedDate) => {
  const existing = await db("member_chapter_mapping")
    .where({ memberId, chapterId })
    .first();
  if (existing) {
    // If status is left, update to joined
    if (existing.status === "left") {
      await db("member_chapter_mapping")
        .where({ memberId, chapterId })
        .update({ status: "joined", joinedDate });
      return "rejoined";
    }
    return existing.status === "joined" ? "already_joined" : "exists";
  } else {
    await db("member_chapter_mapping").insert({
      memberId,
      chapterId,
      status: "joined",
      joinedDate,
    });
    return "added";
  }
};

// Add or update member-chapter mapping with roleIds
const addOrUpdateMemberChapterMappingWithRoles = async (memberId, chapterId, joinedDate, roleIds) => {
  const existing = await db("member_chapter_mapping")
    .where({ memberId, chapterId })
    .first();
  const roleIdsStr = Array.isArray(roleIds) ? roleIds.join(",") : roleIds;
  if (existing) {
    // If status is left, update to joined and set roleIds
    if (existing.status === "left") {
      await db("member_chapter_mapping")
        .where({ memberId, chapterId })
        .update({ status: "joined", joinedDate, roleIds: roleIdsStr });
      return "rejoined";
    }
    return existing.status === "joined" ? "already_joined" : "exists";
  } else {
    await db("member_chapter_mapping").insert({
      memberId,
      chapterId,
      status: "joined",
      joinedDate,
      roleIds: roleIdsStr,
    });
    return "added";
  }
};

module.exports = {
  findMemberByEmail,
  findMemberById,
  addMember,
  getMembers,
  getAllMembers,
  updateMemberBalance,
  updateMemberRoleModel,
  removeMemberFromChapter,
  searchMembers,
  searchMembersByChapter,
  findMemberByPhone,
  getMemberChapterMapping,
  addOrUpdateMemberChapterMapping,
  addOrUpdateMemberChapterMappingWithRoles,
};
