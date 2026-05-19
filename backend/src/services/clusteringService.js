const natural = require("natural");
const Article = require("../models/Article");
const Cluster = require("../models/Cluster");
const env = require("../config/env");
const { buildKeywords, sanitizeText } = require("../utils/text");
const { logger } = require("../utils/logger");

function buildTfidf(texts) {
    const tfidf = new natural.TfIdf();
    texts.forEach((text) => tfidf.addDocument(text));
    const vocabulary = new Set();
    texts.forEach((_, index) => {
        tfidf.listTerms(index).forEach((term) => vocabulary.add(term.term));
    });
    return { tfidf, vocabulary: Array.from(vocabulary) };
}

function vectorize(tfidf, index, vocabulary) {
    return vocabulary.map((term) => tfidf.tfidf(term, index));
}

function cosineSimilarity(a, b) {
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i += 1) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function majoritySentiment(articles) {
    const counts = { Positive: 0, Neutral: 0, Negative: 0 };
    articles.forEach((article) => {
        counts[article.sentiment] = (counts[article.sentiment] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] || "Neutral";
}

function deriveClusterTitle(firstTitle, keywords) {
    if (firstTitle && firstTitle.length <= 90) {
        return firstTitle;
    }
    return keywords.length ? keywords.slice(0, 4).join(" ") : "News Cluster";
}

async function clusterRecentArticles() {
    const candidates = await Article.find({ clusterId: null }).limit(200).lean();
    if (candidates.length < 2) {
        return { created: 0, updated: 0 };
    }

    const texts = candidates.map((article) =>
        sanitizeText(`${article.title}. ${article.description || ""} ${article.content || ""}`)
    );
    const { tfidf, vocabulary } = buildTfidf(texts);
    const vectors = texts.map((_, index) => vectorize(tfidf, index, vocabulary));

    const assigned = new Array(candidates.length).fill(false);
    let created = 0;
    let updated = 0;

    for (let i = 0; i < candidates.length; i += 1) {
        if (assigned[i]) continue;

        const clusterIndices = [i];
        assigned[i] = true;

        for (let j = i + 1; j < candidates.length; j += 1) {
            if (assigned[j]) continue;
            const score = cosineSimilarity(vectors[i], vectors[j]);
            if (score >= env.clusterThreshold) {
                assigned[j] = true;
                clusterIndices.push(j);
            }
        }

        if (clusterIndices.length === 0) continue;

        const clusterArticles = clusterIndices.map((index) => candidates[index]);
        const combinedText = clusterArticles.map((a) => `${a.title} ${a.description || ""}`).join(" ");
        const keywords = buildKeywords(combinedText, 6);
        const clusterTitle = deriveClusterTitle(clusterArticles[0].title, keywords);
        const sentiment = majoritySentiment(clusterArticles);

        const clusterDoc = await Cluster.create({
            clusterTitle,
            keywords,
            articleIds: clusterArticles.map((a) => a._id),
            sentiment
        });

        await Article.updateMany(
            { _id: { $in: clusterArticles.map((a) => a._id) } },
            { $set: { clusterId: clusterDoc._id } }
        );

        created += 1;
        updated += clusterArticles.length;
    }

    logger.info("Clustering complete", { created, updated });
    return { created, updated };
}

module.exports = { clusterRecentArticles };
