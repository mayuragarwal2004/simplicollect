// cron/statisticsCache.js
const cron = require("node-cron");
const homepageModel = require("../model/homepageModel");

// Cache for statistics
let statisticsCache = null;
let cacheTimestamp = null;

// Function to refresh cache
const refreshStatisticsCache = async () => {
  try {
    console.log("Refreshing statistics cache...");
    const statistics = await homepageModel.getStatistics();
    statisticsCache = statistics;
    cacheTimestamp = Date.now();
    console.log("Statistics cache refreshed successfully:", statistics);
  } catch (error) {
    console.error("Error refreshing statistics cache:", error);
  }
};

// Get cached statistics
const getCachedStatistics = () => {
  return {
    data: statisticsCache,
    timestamp: cacheTimestamp
  };
};

// Set cached statistics (for manual updates)
const setCachedStatistics = (data) => {
  statisticsCache = data;
  cacheTimestamp = Date.now();
};

// Clear cache
const clearCache = () => {
  statisticsCache = null;
  cacheTimestamp = null;
};

// Schedule cache refresh every 30 minutes
cron.schedule("*/30 * * * *", async () => {
  await refreshStatisticsCache();
});

// Initial cache load
refreshStatisticsCache();

module.exports = {
  getCachedStatistics,
  setCachedStatistics,
  clearCache,
  refreshStatisticsCache
};
