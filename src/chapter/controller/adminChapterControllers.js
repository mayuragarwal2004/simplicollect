// controllers/adminChapterControllers.js
const adminChapterModel = require("../model/adminChapterModel");

// Get chapter details by chapterId
const getChapterById = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const chapter = await adminChapterModel.findChapterById(chapterId);
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
    const updatedChapter = await adminChapterModel.updateChapter(chapterId, updatedDetails);
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

const getAllChaptersController = async (req, res) => {
  const { memberId } = req.user;
  try {
    console.log({memberId});
    
    const chapters = await adminChapterModel.getAllChapters(memberId);
    res.json(chapters);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

const createChapter = async (req, res) => {
  try {
    const chapterData = req.body;
    
    // Validate required fields
    if (!chapterData.chapterName) {
      return res.status(400).json({ error: "Chapter name is required" });
    }
    
    // Create the chapter
    const newChapter = await adminChapterModel.createChapter(chapterData);
    
    res.status(201).json(newChapter);
  } catch (error) {
    console.error('Error creating chapter:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;
    
    const chapter = await adminChapterModel.getChapterById(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }
    
    await adminChapterModel.deleteChapter(chapterId);
    res.json({ message: "Chapter deleted successfully" });
  } catch (error) {
    console.error('Error deleting chapter:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getChapterById,
  updateChapterDetails,
  getAllChaptersController,
  deleteChapter,
  createChapter,};