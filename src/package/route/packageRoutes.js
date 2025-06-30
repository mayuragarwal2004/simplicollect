const express = require("express");
const packageController = require("../controller/packageController");

const router = express.Router();

router.get("/", packageController.getAllPackages);
router.get("/parent/:parentType", packageController.getPackagesByParentType);
router.get("/all/:chapterId", packageController.getPackagesByChapterController);
router.get("/id/:packageId", packageController.getPackageById);
// Route to get packages by chapter and term
router.get('/all/:chapterId/term/:termId', packageController.getPackagesByChapterAndTermController);
// Route to get all unique package parents for a chapter and term (both required)
router.get("/parents/:chapterId", packageController.getPackageParentsByChapterAndTerm);

module.exports = router;