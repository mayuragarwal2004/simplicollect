// models/chapterModel.js
const db = require("../config/db");

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
module.exports = {
  findChapterById,
  updateChapter
};
