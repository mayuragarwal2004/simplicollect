const db = require("../../config/db");

// Function to find a chapter by its ID
const findChapterById = async (chapterId) => {
  return db("chapters")
    .where("chapterId", chapterId)
    .first();
};

const findChapterBySlug = async (chapterSlug) => {
  return db("chapters")
    .where("chapterSlug", chapterSlug)
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
    .leftJoin("member_chapter_mapping", "chapters.chapterId", "member_chapter_mapping.chapterId")
    .select(
      "chapters.*",
      "organisations.organisationName",
      db.raw("COUNT(CASE WHEN member_chapter_mapping.status = 'joined' THEN 1 END) as numberOfMembers")
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
    .insert(chapterData);
};

// Function to delete a chapter by its ID
const deleteChapter = async (chapterId) => {
  return db("chapters")
    .where("chapterId", chapterId)
    .del();
};

const addRole = async (chapterSlug, roleData) => {
  const chapter = await db("chapters")
    .where("chapterSlug", chapterSlug)
    .first();

  if (!chapter) {
    throw new Error("Chapter not found");
  }

  return db("roles")
    .insert({ ...roleData, chapterId: chapter.chapterId })
    .returning("*");
}
const editRole = async (chapterSlug, roleId, updatedRoleData) => {
  const chapter = await db("chapters")
    .where("chapterSlug", chapterSlug)
    .first();

  if (!chapter) {
    throw new Error("Chapter not found");
  }

  return db("roles")
    .where({ roleId, chapterId: chapter.chapterId })
    .update(updatedRoleData)
    .returning("*");
}
const deleteRole = async (chapterSlug, roleId) => {
  const chapter = await db("chapters")
    .where("chapterSlug", chapterSlug)
    .first();

  if (!chapter) {
    throw new Error("Chapter not found");
  }

  return db("roles")
    .where({ roleId, chapterId: chapter.chapterId })
    .del();
}

module.exports = {
  findChapterById,
  findChapterBySlug,
  updateChapter,
  getAllChapters,
  createChapter,
  deleteChapter,
  addRole,
  editRole,
  deleteRole
};
