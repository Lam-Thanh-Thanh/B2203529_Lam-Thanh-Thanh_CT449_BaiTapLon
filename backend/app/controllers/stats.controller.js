const MongoDB = require("../utils/mongodb.util");
const StatsService = require("../services/stats.service");

// Admin Dashboard
exports.overview = async (req, res, next) => {
  try {
    const svc = new StatsService(MongoDB.getClient());
    const data = await svc.getOverview();
    res.json(data);
  } catch (e) {
    next(e);
  }
};

// Public Trending
exports.trending = async (req, res, next) => {
  try {
    const svc = new StatsService(MongoDB.getClient());
    // Lấy top 8 cuốn
    const data = await svc.getTrendingBooks(8);
    res.json(data);
  } catch (e) {
    next(e);
  }
};