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

  // join the current member with the chapters table using the member_chapter_mapping, also join the organisation using th eorganisation id in the chapters table
  return db("chapters")
    .join("member_chapter_mapping", "chapters.chapterId", "member_chapter_mapping.chapterId")
    .join("organisations", "chapters.organisationId", "organisations.organisationId")
    .where("member_chapter_mapping.memberId", memberId)
    .select("chapters.*", "organisations.organisationName")
    .orderBy("chapters.chapterName", "asc");
}

module.exports = {
  findChapterById,
  updateChapter,
  getAllChapters,
};
