const express = require("express");
const { fetchAndProcessNews } = require("../services/newsIngestService");
const router = express.Router();

// Protected endpoint (apiKeyAuth applied globally to /api)
router.post("/admin/ingest", async (req, res) => {
    try {
        const result = await fetchAndProcessNews();
        return res.json({ success: true, inserted: result.inserted });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message || String(err) });
    }
});

module.exports = router;
