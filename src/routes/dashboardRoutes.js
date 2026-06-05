const express = require("express");
const router = express.Router();
const { getDashboardOverview } = require("../controllers/dashboardController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/dashboard", protect, getDashboardOverview);

module.exports = router;
