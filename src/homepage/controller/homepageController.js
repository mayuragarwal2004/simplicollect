// controllers/homepageController.js
const homepageModel = require("../model/homepageModel");
const statisticsCache = require("../cron/statisticsCache");

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

// Get statistics with caching
const getStatistics = async (req, res) => {
  try {
    const cachedData = statisticsCache.getCachedStatistics();
    const currentTime = Date.now();
    
    // Check if cache exists and is valid
    if (cachedData.data && cachedData.timestamp && (currentTime - cachedData.timestamp < CACHE_DURATION)) {
      return res.json({
        success: true,
        data: cachedData.data,
        cached: true,
        cacheAge: Math.floor((currentTime - cachedData.timestamp) / 1000 / 60) // in minutes
      });
    }

    // If cache is stale or doesn't exist, fetch fresh data
    const statistics = await homepageModel.getStatistics();
    
    // Update cache
    statisticsCache.setCachedStatistics(statistics);

    res.json({
      success: true,
      data: statistics,
      cached: false
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch statistics",
      error: error.message 
    });
  }
};

// Newsletter subscription
const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address"
      });
    }

    // Save email to database
    const result = await homepageModel.saveNewsletterEmail(email);

    if (result.success) {
      res.status(201).json({
        success: true,
        message: result.message
      });
    } else {
      res.status(409).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    res.status(500).json({
      success: false,
      message: "Failed to subscribe to newsletter",
      error: error.message
    });
  }
};

// Clear statistics cache (utility function for admin or cron jobs)
const clearStatisticsCache = (req, res) => {
  statisticsCache.clearCache();
  
  if (res) {
    res.json({
      success: true,
      message: "Statistics cache cleared successfully"
    });
  }
};

// Get cache status (utility function)
const getCacheStatus = (req, res) => {
  const cachedData = statisticsCache.getCachedStatistics();
  const currentTime = Date.now();
  const cacheAge = cachedData.timestamp ? Math.floor((currentTime - cachedData.timestamp) / 1000 / 60) : null;
  const isValid = cachedData.timestamp && (currentTime - cachedData.timestamp < CACHE_DURATION);

  res.json({
    success: true,
    cache: {
      exists: !!cachedData.data,
      isValid: isValid,
      ageInMinutes: cacheAge,
      expiresInMinutes: isValid ? Math.floor((CACHE_DURATION - (currentTime - cachedData.timestamp)) / 1000 / 60) : 0
    }
  });
};

module.exports = {
  getStatistics,
  subscribeNewsletter,
  clearStatisticsCache,
  getCacheStatus
};
