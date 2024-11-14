const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberControllers");

// Member routes
router.get("/me", memberController.getMemberById);

module.exports = router;