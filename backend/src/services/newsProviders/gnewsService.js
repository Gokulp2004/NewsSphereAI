const axios = require("axios");
const env = require("../../config/env");
const { withRetry } = require("../../utils/retry");

const BASE_URL = "https://gnews.io/api/v4/search";

async function fetchByTopic(topic) {
    if (!env.gnewsApiKey) {
        return [];
    }

    // Expand queries for broad coverage on certain topics
    const topicKey = (topic || "").toLowerCase();
    const synonyms = {
        technology: "technology OR tech OR gadgets OR innovation",
        sports: "sports OR football OR soccer OR cricket OR nba",
        ai: "ai OR artificial intelligence OR machine learning"
    };

    const q = synonyms[topicKey] || topic;

    const response = await withRetry(() =>
        axios.get(BASE_URL, {
            params: {
                q,
                lang: "en",
                max: env.newsPageSize,
                token: env.gnewsApiKey
            },
            timeout: 10000
        })
    );

    const articles = response.data?.articles || [];
    return articles.map((article) => ({
        title: article.title,
        description: article.description,
        content: article.content || article.description,
        source: article.source?.name || "GNews",
        url: article.url,
        image: article.image,
        publishedAt: article.publishedAt,
        author: article.source?.name,
        topic
    }));
}

async function fetchByTopics(topics) {
    const results = await Promise.allSettled(topics.map((topic) => fetchByTopic(topic)));
    return results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
}

module.exports = { fetchByTopics };
