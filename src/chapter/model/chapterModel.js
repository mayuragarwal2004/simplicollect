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

  // join the current member with the chapters table using the memberChapterMapping, also join the organisation using th eorganisation id in the chapters table
  return db("chapters")
    .join("memberChapterMapping", "chapters.chapterId", "memberChapterMapping.chapterId")
    .join("organisations", "chapters.organisationId", "organisations.organisationId")
    .where("memberChapterMapping.memberId", memberId)
    .select("chapters.*", "organisations.organisationName")
    .orderBy("chapters.chapterName", "asc");
}

module.exports = {
  findChapterById,
  updateChapter,
  getAllChapters,
};
