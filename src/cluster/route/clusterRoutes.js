// routes/clusterRoutes.js
const express = require("express");
const router = express.Router();
const clusterController = require("../controller/clusterController");
const { authenticateToken, AuthenticateAdmin } = require("../../middlewares/authMiddleware");

// Get all clusters for a chapter
router.get("/:chapterSlug", authenticateToken, AuthenticateAdmin, clusterController.getClustersByChapterSlug);

// Create a new cluster
router.post("/:chapterSlug", authenticateToken, AuthenticateAdmin, clusterController.createCluster);

// Update a cluster
router.put("/:clusterId", authenticateToken, AuthenticateAdmin, clusterController.updateCluster);

// Delete a cluster
router.delete("/:clusterId", authenticateToken, AuthenticateAdmin, clusterController.deleteCluster);

// Members management
router.get("/:clusterId/members", authenticateToken, AuthenticateAdmin, clusterController.getClusterMembers);
router.get("/:clusterId/search-members", authenticateToken, AuthenticateAdmin, clusterController.searchChapterMembers);
router.post("/:clusterId/members", authenticateToken, AuthenticateAdmin, clusterController.addMemberToCluster);
router.delete("/:clusterId/members/:memberId", authenticateToken, AuthenticateAdmin, clusterController.removeMemberFromCluster);

// Packages management
router.get("/:clusterId/packages", authenticateToken, AuthenticateAdmin, clusterController.getClusterPackages);
router.post("/:clusterId/packages", authenticateToken, AuthenticateAdmin, clusterController.addPackageToCluster);
router.delete("/:clusterId/packages/:packageId", authenticateToken, AuthenticateAdmin, clusterController.removePackageFromCluster);

module.exports = router;
