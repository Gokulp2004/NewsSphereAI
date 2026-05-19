const express = require("express");
const digestRoutes = require("./digestRoutes");
const topicRoutes = require("./topicRoutes");
const articleRoutes = require("./articleRoutes");
const trendingRoutes = require("./trendingRoutes");
const subscriptionRoutes = require("./subscriptionRoutes");
const adminRoutes = require("./adminRoutes");

const router = express.Router();

router.use(digestRoutes);
router.use(topicRoutes);
router.use(articleRoutes);
router.use(trendingRoutes);
router.use(subscriptionRoutes);
router.use(adminRoutes);

module.exports = router;
