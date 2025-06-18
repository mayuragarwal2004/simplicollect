// controllers/packageController.js
const Package = require("../model/packageModel");
const {
  getPendingMeetings,
  approveMeeting,
} = require("../model/packageModel");

const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.getAllPackages();
    res.json(packages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ error: "Failed to fetch packages" });
  }
};

const getPackagesByParentType = async (req, res) => {
  const { parentType } = req.params;
  try {
    const packages = await Package.getPackagesByParentType(parentType);
    res.json(packages);
  } catch (error) {
    console.error("Error fetching packages by parent type:", error);
    res.status(500).json({ error: "Failed to fetch packages" });
  }
};

const getPackageById = async (req, res) => {
  const { packageId } = req.params;
  try {
    const package = await Package.getPackageById(packageId);
    if (!package) {
      return res.status(404).json({ error: "Package not found" });
    }
    res.json(package);
  } catch (error) {
    console.error("Error fetching package details:", error);
    res.status(500).json({ error: "Failed to fetch package details" });
  }
};

const fetchPendingMeetings = async (req, res) => {
  try {
    const pendingMeetings = await getPendingMeetings();
    res.status(200).json({ success: true, data: pendingMeetings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const approvedMeeting = async (req, res) => {
  const { memberId } = req.body; // Use req.body for POST requests
  try {
    const updatedRows = await approveMeeting(memberId);
    if (!updatedRows) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Meeting approved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getPackagesByChapterController = async (req, res) => {
  let { memberId } = req.query;
  if (!memberId) {
    memberId = req.user.memberId;
  }
  const { chapterId } = req.params;
  try {
    const packages = await Package.getPackagesByChapterId(chapterId, memberId);
    res.json(packages);
  } catch (error) {
    console.error("Error fetching packages by chapter:", error);
    res.status(500).json({ error: "Failed to fetch packages" });
  }
};

// Fetch packages by chapterId and termId (optionally memberId)
const getPackagesByChapterAndTermController = async (req, res) => {
  const { chapterId, termId } = req.params;
  let { memberId } = req.query;
  if (!memberId) {
    memberId = req.user.memberId; // Use the memberId from the request context
  }
  try {
    const packages = await Package.getPackagesByChapterAndTerm(chapterId, termId, memberId);
    res.json(packages);
  } catch (error) {
    console.error("Error fetching packages by chapter and term:", error);
    res.status(500).json({ error: "Failed to fetch packages" });
  }
};

module.exports = {
  getAllPackages,
  getPackagesByParentType,
  getPackageById,
  fetchPendingMeetings,
  getPackagesByChapterController,
  getPackagesByChapterAndTermController,
};
