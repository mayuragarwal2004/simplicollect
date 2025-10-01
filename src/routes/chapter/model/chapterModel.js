// models/chapterModel.js
const db = require("../../../config/db");

// Function to find a chapter by its ID
const findChapterById = async (chapterId) => {
  return db("chapters")
    .where("chapterId", chapterId)
    .first();
};

const updateChapter = async (chapterId, chapterData) => {
  return db("chapters")
    .where("chapterId", chapterId).update(chapterData)
}

const getAllChapters = async (memberId) => {
  return db("chapters")
    .join("member_chapter_mapping", "chapters.chapterId", "member_chapter_mapping.chapterId")
    .join("organisations", "chapters.organisationId", "organisations.organisationId")
    .joinRaw("JOIN roles ro ON FIND_IN_SET(ro.roleId, member_chapter_mapping.roleIds) > 0")
    .where("member_chapter_mapping.memberId", memberId)
    .where("member_chapter_mapping.status", "joined")
    .select(
      "chapters.*",
      "organisations.organisationName",
      db.raw("GROUP_CONCAT(ro.roleName ORDER BY ro.roleName ASC SEPARATOR ', ') as roleNames") // Adds space after comma
    )
    .groupBy("chapters.chapterId") // Ensuring unique chapter entries
    .orderBy("chapters.chapterName", "asc");
};


const findChapterBySlug = async (chapterSlug) => {
  return db("chapters").where("chapterSlug", chapterSlug).select("*").first();
};

const getRolesByChapterSlug = async (chapterSlug) => {
  const roles = await db("roles")
    .join("chapters", "roles.chapterId", "chapters.chapterId")
    .leftJoin("features_master", function () {
      this.on(db.raw("FIND_IN_SET(features_master.featureId, roles.rights)"));
    })
    .where("chapters.chapterSlug", chapterSlug)
    .groupBy("roles.roleId")
    .select(
      "roles.*",
      db.raw("GROUP_CONCAT(features_master.featureName SEPARATOR ', ') as featureNames")
    );

  return roles;
};

// Get default roles for a chapter (returns array of roleIds as strings)
const getDefaultRoleIdsForChapter = async (chapterId) => {
  const roles = await db("roles")
    .where({ chapterId, default: true })
    .select("roleId");
  return roles.map(r => r.roleId.toString());
};

module.exports = {
  findChapterById,
  updateChapter,
  getAllChapters,
  findChapterBySlug,
  getRolesByChapterSlug,
  getDefaultRoleIdsForChapter,
};
