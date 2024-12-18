// controllers/chapterControllers.js
const chapterModel = require("../models/chapterModel");

// Get chapter details by chapterId
const getChapterById = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const chapter = await chapterModel.findChapterById(chapterId);
    if (chapter) {
      res.json(chapter);
    } else {
      res.status(404).json({ message: "Chapter not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const updateChapterDetails = async (req, res) => {
  const { chapterId } = req.params;
  const updatedDetails = req.body;
  try {
    const updatedChapter = await chapterModel.updateChapter(chapterId, updatedDetails);
    if (updatedChapter) {
      res.json(updatedChapter);
    } else {
      res.status(404).json({ message: "Chapter not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getChapterById,
  updateChapterDetails,
};