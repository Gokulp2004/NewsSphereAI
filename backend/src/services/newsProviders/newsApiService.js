const axios = require("axios");
const env = require("../../config/env");
const { withRetry } = require("../../utils/retry");

const BASE_URL = "https://newsapi.org/v2/everything";

async function fetchByTopic(topic) {
    if (!env.newsApiKey) {
        return [];
    }

    const response = await withRetry(() =>
        axios.get(BASE_URL, {
            params: {
                q: topic,
                language: "en",
                pageSize: env.newsPageSize,
                sortBy: "publishedAt",
                apiKey: env.newsApiKey
            },
            timeout: 10000
        })
    );

    const articles = response.data?.articles || [];
    return articles.map((article) => ({
        title: article.title,
        description: article.description,
        content: article.content || article.description,
        source: article.source?.name || "NewsAPI",
        url: article.url,
        image: article.urlToImage,
        publishedAt: article.publishedAt,
        author: article.author,
        topic
    }));
}

async function fetchByTopics(topics) {
    const results = await Promise.allSettled(topics.map((topic) => fetchByTopic(topic)));
    return results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
}

module.exports = { fetchByTopics };
