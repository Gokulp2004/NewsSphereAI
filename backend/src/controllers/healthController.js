const { success } = require("../utils/response");

function getHealth(req, res) {
    return success(res, { data: { status: "ok" }, message: "Healthy" });
}

module.exports = { getHealth };
