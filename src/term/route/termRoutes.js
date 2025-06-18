const express = require("express");
const termController = require("../controller/termController");

const router = express.Router();

// Route to get all terms for a chapter
router.get('/chapter/:chapterId', termController.getTermsByChapter);

module.exports = router;