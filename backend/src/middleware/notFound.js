const { error } = require("../utils/response");

function notFound(req, res) {
    return error(res, { status: 404, message: "Route not found" });
}

module.exports = { notFound };
