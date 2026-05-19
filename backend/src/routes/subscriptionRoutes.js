const express = require("express");
const { body } = require("express-validator");
const { subscribe } = require("../controllers/subscriptionController");
const { asyncHandler } = require("../utils/asyncHandler");
const { validate } = require("../middleware/validate");

const router = express.Router();

router.post(
    "/subscribe",
    [
        body("email").isEmail().withMessage("Valid email required"),
        body("topics").isArray({ min: 1 }).withMessage("Topics must be an array")
    ],
    validate,
    asyncHandler(subscribe)
);

module.exports = router;
