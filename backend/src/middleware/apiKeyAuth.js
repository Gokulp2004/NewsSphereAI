const env = require("../config/env");
const { error } = require("../utils/response");

function apiKeyAuth(req, res, next) {
    if (!env.apiKey) {
        return next();
    }

    const provided = req.header("x-api-key");
    if (!provided || provided !== env.apiKey) {
        return error(res, { status: 401, message: "Invalid API key" });
    }

    return next();
}

module.exports = { apiKeyAuth };
