const express = require("express");
const { getArticle } = require("../controllers/articleController");
const { asyncHandler } = require("../utils/asyncHandler");

const router = express.Router();

router.get("/article/:id", asyncHandler(getArticle));

module.exports = router;
