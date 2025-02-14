const express = require("express");
const packageController = require("../controllers/packageController");

const router = express.Router();

router.get("/", packageController.getAllPackages);
router.get("/parent/:parentType", packageController.getPackagesByParentType);
router.get("/id/:packageId", packageController.getPackageById);

module.exports = router;