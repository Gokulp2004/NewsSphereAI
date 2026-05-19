require("dotenv").config();
const app = require("./app");
const env = require("./config/env");
const { connectDb } = require("./config/db");
const { startFetchNewsJob } = require("./jobs/fetchNewsJob");
const { fetchAndProcessNews } = require("./services/newsIngestService");
const { logger } = require("./utils/logger");

async function startServer() {
    try {
        await connectDb();

        if (env.runIngestOnStart) {
            fetchAndProcessNews().catch((error) =>
                logger.error("Initial ingest failed", error.message || error)
            );
        }

        startFetchNewsJob();

        app.listen(env.port, () => {
            logger.info(`API running on port ${env.port}`);
        });
    } catch (error) {
        logger.error("Failed to start server", error.message || error);
        process.exit(1);
    }
}

startServer();
