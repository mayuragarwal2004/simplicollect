// models/chapterModel.js
const db = require("../../config/db");

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
    .select(
      "chapters.*",
      "organisations.organisationName",
      db.raw("GROUP_CONCAT(ro.roleName ORDER BY ro.roleName ASC SEPARATOR ', ') as roleNames") // Adds space after comma
    )
    .groupBy("chapters.chapterId") // Ensuring unique chapter entries
    .orderBy("chapters.chapterName", "asc");
};

module.exports = {
  findChapterById,
  updateChapter,
  getAllChapters,
};
