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
  const { rows, page } = req.query; 

  try {
    const { chapters, totalRecords } = await adminChapterModel.getAllChapters(rows, page);
    if (!chapters || chapters.length === 0) {
      return res.status(404).json({ message: "No chapters found" });
    }
    res.json({
      data: chapters,
      totalRecords,
      rows,
      page,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const createChapter = async (req, res) => {
  try {
    const chapterData = req.body;
    
    // Validate required fields
    if (!chapterData.chapterName || !chapterData.chapterSlug || !chapterData.meetingPeriodicity || !chapterData.meetingPaymentType || !chapterData.visitorPerMeetingFee || !chapterData.organisationId) {
      return res.status(400).json({ error: "Required fields are missing" });
    }
    const validPeriodicities = ['weekly', 'fortnightly', 'monthly', 'bi-monthly', 'quarterly', '6-monthly', 'yearly'];
    if (!validPeriodicities.includes(chapterData.meetingPeriodicity)) {
      return res.status(400).json({ error: "Invalid meeting periodicity" });
    }

    const validPaymentTypes = ['weekly', 'monthly', 'quarterly'];
    if (!chapterData.meetingPaymentType.split(',').every(type => validPaymentTypes.includes(type.trim()))) {
      return res.status(400).json({ error: "Invalid meeting payment type" });
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
    
    const chapter = await adminChapterModel.findChapterById(chapterId);
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

const getRolesByChapterSlug = async (req, res) => {
  const { chapterSlug } = req.params;
  try {
    const roles = await adminChapterModel.getRolesByChapterSlug(chapterSlug);
    if (roles) {
      res.json(roles);
    } else {
      res.status(404).json({ message: "Roles not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getChapterById,
  updateChapterDetails,
  getAllChaptersController,
  deleteChapter,
  createChapter,
  getRolesByChapterSlug,
};