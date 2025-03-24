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
const getAllChapters = async (rows, page) => {
  const limit = parseInt(rows, 10) || 10;
  const pageNumber = parseInt(page, 10) || 1;
  const offset = (pageNumber - 1) * limit;

  const [{ count }] = await db("chapters").count("chapterId as count");

  if (offset >= count) {
    return { chapters: [], totalRecords: parseInt(count, 10) };
  }

  const chapters = await db("chapters")
    .join("organisations", "chapters.organisationId", "organisations.organisationId")
    .leftJoin("memberchaptermapping", "chapters.chapterId", "memberchaptermapping.chapterId")
    .select(
      "chapters.*",
      "organisations.organisationName",
      db.raw("COUNT(CASE WHEN memberchaptermapping.status = 'joined' THEN 1 END) as numberOfMembers")
    )
    .groupBy("chapters.chapterId", "organisations.organisationName")
    .orderBy("chapters.chapterName", "asc")
    .limit(limit)
    .offset(offset);

  return { chapters, totalRecords: parseInt(count, 10) };
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
