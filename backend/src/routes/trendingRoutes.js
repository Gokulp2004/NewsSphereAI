const express = require("express");
const { getTrending } = require("../controllers/trendingController");
const { asyncHandler } = require("../utils/asyncHandler");

const router = express.Router();

router.get("/trending", asyncHandler(getTrending));

module.exports = router;
