function success(res, { data = null, message = "OK", meta = null } = {}) {
    return res.json({
        success: true,
        message,
        data,
        meta
    });
}

function error(res, { status = 500, message = "Error", errors = null } = {}) {
    return res.status(status).json({
        success: false,
        message,
        errors
    });
}

module.exports = { success, error };
