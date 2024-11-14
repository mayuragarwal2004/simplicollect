// models/chapterModel.js
const db = require("../config/db");

// Function to find a chapter by its ID
const findChapterById = async (chapterId) => {
  return db("chapters")
    .where("chapterId", chapterId)
    .first();
};

module.exports = {
  findChapterById,
};
