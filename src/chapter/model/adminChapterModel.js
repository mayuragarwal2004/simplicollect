const db = require("../../config/db");

// Function to find a chapter by its ID
const findChapterById = async (chapterId) => {
  return db("chapters")
    .where("chapterId", chapterId)
    .first();
};

// Function to update chapter details
const updateChapter = async (chapterId, chapterData) => {
  return db("chapters")
    .where("chapterId", chapterId)
    .update(chapterData)
    .returning("*");
};

// Function to get all chapters (admin has access to all)
const getAllChapters = async () => {
  return db("chapters")
    .join("organisations", "chapters.organisationId", "organisations.organisationId")
    .select("chapters.*", "organisations.organisationName")
    .orderBy("chapters.chapterName", "asc");
};

// Function to create a new chapter
const createChapter = async (chapterData) => {
  return db("chapters")
    .insert(chapterData)
    .returning("*");
};

// Function to delete a chapter by its ID
const deleteChapter = async (chapterId) => {
  return db("chapters")
    .where("chapterId", chapterId)
    .del();
};

module.exports = {
  findChapterById,
  updateChapter,
  getAllChapters,
  createChapter,
  deleteChapter,
};
