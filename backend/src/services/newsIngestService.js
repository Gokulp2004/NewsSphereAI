const Article = require("../models/Article");
const env = require("../config/env");
const { hashUrl } = require("../utils/hash");
const { summarizeArticle } = require("./summarizerService");
const { analyzeSentiment } = require("./sentimentService");
const { clusterRecentArticles } = require("./clusteringService");
const { flushCache } = require("./cacheService");
const newsApiService = require("./newsProviders/newsApiService");
const gnewsService = require("./newsProviders/gnewsService");
const { logger } = require("../utils/logger");

async function fetchFromProviders() {
    const providers = [];
    if (env.newsApiKey) providers.push(newsApiService);
    if (env.gnewsApiKey) providers.push(gnewsService);

    const results = await Promise.allSettled(
        providers.map((provider) => provider.fetchByTopics(env.topics))
    );

    return results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
}

async function ingestArticle(article) {
    if (!article?.url || !article?.title) {
        return { inserted: false };
    }

    const urlHash = hashUrl(article.url);
    const exists = await Article.findOne({ urlHash }).select("_id");
    if (exists) {
        return { inserted: false };
    }

    const summary = await summarizeArticle(article.content || article.description || article.title);
    const sentiment = analyzeSentiment(`${article.title} ${article.description || ""}`);

    await Article.create({
        ...article,
        urlHash,
        summary,
        sentiment,
        publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date()
    });

    return { inserted: true };
}

async function fetchAndProcessNews() {
    const fetched = await fetchFromProviders();
    if (fetched.length === 0) {
        logger.warn("No news fetched from providers");
        return { inserted: 0 };
    }

    let inserted = 0;
    for (const article of fetched) {
        const result = await ingestArticle(article);
        if (result.inserted) inserted += 1;
    }

    await clusterRecentArticles();
    flushCache();

    logger.info("News ingest finished", { inserted });
    return { inserted };
}

module.exports = { fetchAndProcessNews };
