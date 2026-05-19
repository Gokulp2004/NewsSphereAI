const cron = require("node-cron");
const env = require("../config/env");
const { fetchAndProcessNews } = require("../services/newsIngestService");
const { logger } = require("../utils/logger");

function startFetchNewsJob() {
    cron.schedule(env.cronSchedule, async () => {
        try {
            logger.info("Running scheduled news ingest");
            await fetchAndProcessNews();
        } catch (error) {
            logger.error("Scheduled ingest failed", error.message || error);
        }
    });
}

module.exports = { startFetchNewsJob };
