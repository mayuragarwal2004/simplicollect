// controllers/packageController.js
const Package = require("../models/packageModel");

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

module.exports = {
  getAllPackages,
  getPackagesByParentType,
  getPackageById,
};