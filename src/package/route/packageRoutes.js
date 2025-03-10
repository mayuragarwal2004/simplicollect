const express = require("express");
const packageController = require("../controller/packageController");

const router = express.Router();

router.get("/", packageController.getAllPackages);
router.get("/parent/:parentType", packageController.getPackagesByParentType);
router.get("/all/:chapterId", packageController.getPackagesByChapterController);
router.get("/id/:packageId", packageController.getPackageById);

module.exports = router;