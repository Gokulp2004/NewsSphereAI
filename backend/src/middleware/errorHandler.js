const { error } = require("../utils/response");
const { logger } = require("../utils/logger");

function errorHandler(err, req, res, next) {
    logger.error("Unhandled error", err.message || err);
    return error(res, { status: 500, message: "Server error" });
}

module.exports = { errorHandler };
