const { validationResult } = require("express-validator");
const { error } = require("../utils/response");

function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return error(res, { status: 400, message: "Validation error", errors: errors.array() });
    }
    return next();
}

module.exports = { validate };
