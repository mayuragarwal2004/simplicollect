// routes/homepageRoutes.js
const express = require("express");
const router = express.Router();
const homepageController = require("../controller/homepageController");

// Get homepage statistics (cached)
router.get("/statistics", homepageController.getStatistics);

// Subscribe to newsletter
router.post("/newsletter", homepageController.subscribeNewsletter);

// Utility routes (optional - for cache management)
router.delete("/cache/statistics", homepageController.clearStatisticsCache);
router.get("/cache/status", homepageController.getCacheStatus);

module.exports = router;
