// controllers/clusterController.js
const clusterModel = require("../model/clusterModel");
const { v4: uuidv4 } = require("uuid");
const { findChapterBySlug } = require("../../chapter/model/chapterModel");

const getClustersByChapterSlug = async (req, res) => {
  try {
    const { chapterSlug } = req.params;
    const clusters = await clusterModel.getClustersByChapterSlug(chapterSlug);
    res.json(clusters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCluster = async (req, res) => {
  try {
    const { chapterSlug } = req.params;
    const { clusterName, description } = req.body;

    const chapter = await findChapterBySlug(chapterSlug);
    if (!chapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }

    const clusterId = uuidv4();
    const cluster = await clusterModel.createCluster({
      clusterId,
      chapterId: chapter.chapterId,
      clusterName,
      description
    });

    res.status(201).json(cluster);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCluster = async (req, res) => {
  try {
    const { clusterId } = req.params;
    const { clusterName, description } = req.body;

    const existingCluster = await clusterModel.getClusterById(clusterId);
    if (!existingCluster) {
      return res.status(404).json({ error: "Cluster not found" });
    }

    const updatedCluster = await clusterModel.updateCluster(clusterId, {
      clusterName,
      description
    });

    res.json(updatedCluster);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCluster = async (req, res) => {
  try {
    const { clusterId } = req.params;
    
    const existingCluster = await clusterModel.getClusterById(clusterId);
    if (!existingCluster) {
      return res.status(404).json({ error: "Cluster not found" });
    }

    await clusterModel.deleteCluster(clusterId);
    res.json({ message: "Cluster deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getClusterMembers = async (req, res) => {
  try {
    const { clusterId } = req.params;
    const members = await clusterModel.getClusterMembers(clusterId);
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchChapterMembers = async (req, res) => {
  try {
    const { clusterId } = req.params;
    const { search } = req.query;
    
    if (!search || !clusterId) {
      return res.status(400).json({ error: "Search query and clusterId are required." });
    }

    const members = await clusterModel.searchChapterMembers(clusterId, search);
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addMemberToCluster = async (req, res) => {
  try {
    const { clusterId } = req.params;
    const { memberId } = req.body;

    await clusterModel.addMemberToCluster(clusterId, memberId);
    res.json({ message: "Member added to cluster successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeMemberFromCluster = async (req, res) => {
  try {
    const { clusterId, memberId } = req.params;

    await clusterModel.removeMemberFromCluster(clusterId, memberId);
    res.json({ message: "Member removed from cluster successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getClusterPackages = async (req, res) => {
  try {
    const { clusterId } = req.params;
    const packages = await clusterModel.getClusterPackages(clusterId);
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addPackageToCluster = async (req, res) => {
  try {
    const { clusterId } = req.params;
    const { packageId } = req.body;

    await clusterModel.addPackageToCluster(clusterId, packageId);
    res.json({ message: "Package added to cluster successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removePackageFromCluster = async (req, res) => {
  try {
    const { clusterId, packageId } = req.params;

    await clusterModel.removePackageFromCluster(clusterId, packageId);
    res.json({ message: "Package removed from cluster successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const bulkUpdateMembers = async (req, res) => {
  try {
    const { chapterSlug } = req.params;
    const { updates } = req.body;

    const chapter = await findChapterBySlug(chapterSlug);
    if (!chapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }

    await clusterModel.bulkUpdateMembers(chapter.chapterId, updates);
    res.json({ message: "Member cluster assignments updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const bulkUpdatePackages = async (req, res) => {
  try {
    const { chapterSlug } = req.params;
    const { updates } = req.body;

    const chapter = await findChapterBySlug(chapterSlug);
    if (!chapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }

    await clusterModel.bulkUpdatePackages(chapter.chapterId, updates);
    res.json({ message: "Package cluster assignments updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPackageMappings = async (req, res) => {
  try {
    const { chapterSlug, termId } = req.params;

    const chapter = await findChapterBySlug(chapterSlug);
    if (!chapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }

    const mappings = await clusterModel.getPackageMappings(chapter.chapterId, termId);
    res.json(mappings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getClustersByChapterSlug,
  createCluster,
  updateCluster,
  deleteCluster,
  getClusterMembers,
  searchChapterMembers,      // Added this export
  addMemberToCluster,
  removeMemberFromCluster,
  getClusterPackages,
  addPackageToCluster,
  removePackageFromCluster,
  bulkUpdateMembers,
  bulkUpdatePackages,
  getPackageMappings
};
