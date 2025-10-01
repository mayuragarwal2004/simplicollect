const express = require("express");
const packageController = require("../controller/packageController");
const { authenticateToken, AuthenticateAdmin } = require("../../../middlewares/authMiddleware");

const router = express.Router();

router.get("/", packageController.getAllPackages);
router.get("/parent/:parentType", packageController.getPackagesByParentType);
router.get("/all/:chapterId", packageController.getPackagesByChapterController);
router.get("/id/:packageId", packageController.getPackageById);
// Route to get packages by chapter and term
router.get('/all/:chapterId/term/:termId', packageController.getPackagesByChapterAndTermController);
// Admin-only route to get ALL packages by chapter and term without cluster filtering
router.get('/admin/all/:chapterSlug/term/:termId', authenticateToken, AuthenticateAdmin, packageController.getAllPackagesByChapterAndTermAdminController);
// Route to get all unique package parents for a chapter and term (both required)
router.get("/parents/:chapterId", packageController.getPackageParentsByChapterAndTerm);

module.exports = router;