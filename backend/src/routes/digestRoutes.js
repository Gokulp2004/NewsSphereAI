const express = require("express");
const { getDigest } = require("../controllers/digestController");
const { asyncHandler } = require("../utils/asyncHandler");

const router = express.Router();

router.get("/digest", asyncHandler(getDigest));

module.exports = router;
