const env = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || "5000", 10),
    mongoUri: process.env.MONGO_URI || "",
    newsApiKey: process.env.NEWSAPI_KEY || "",
    gnewsApiKey: process.env.GNEWS_API_KEY || "",
    openaiApiKey: process.env.OPENAI_API_KEY || "",
    openaiModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
    apiKey: process.env.API_KEY || "",
    corsOrigin: process.env.CORS_ORIGIN || "*",
    cronSchedule: process.env.CRON_SCHEDULE || "*/30 * * * *",
    topics: process.env.NEWS_TOPICS
        ? process.env.NEWS_TOPICS.split(",").map((t) => t.trim()).filter(Boolean)
        : ["ai", "technology", "business", "science", "health", "world", "sports"],
    clusterThreshold: parseFloat(process.env.CLUSTER_THRESHOLD || "0.35"),
    cacheTtlSeconds: parseInt(process.env.CACHE_TTL_SECONDS || "300", 10),
    pageLimitDefault: parseInt(process.env.PAGE_LIMIT_DEFAULT || "12", 10),
    pageLimitMax: parseInt(process.env.PAGE_LIMIT_MAX || "50", 10),
    newsPageSize: parseInt(process.env.NEWS_PAGE_SIZE || "20", 10),
    runIngestOnStart: process.env.RUN_INGEST_ON_START !== "false"
};

module.exports = env;
