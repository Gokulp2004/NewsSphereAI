const express = require("express");
const { getTopicNews } = require("../controllers/topicController");
const { asyncHandler } = require("../utils/asyncHandler");

const router = express.Router();

router.get("/topic/:name", asyncHandler(getTopicNews));

module.exports = router;
