const Article = require("../models/Article");
const Cluster = require("../models/Cluster");
const env = require("../config/env");
const { success } = require("../utils/response");
const { getCache, setCache } = require("../services/cacheService");

function parseLimit(value) {
    const limit = parseInt(value || env.pageLimitDefault, 10);
    return Math.min(limit, env.pageLimitMax);
}

function escapeRegExp(value) {
    return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function tokenizeQuery(value) {
    return String(value || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
}

function buildFilters(query) {
    const filters = {};
    if (query.topic) filters.topic = query.topic;
    if (query.sentiment) filters.sentiment = query.sentiment;
    if (query.q) {
        const terms = tokenizeQuery(query.q);
        const fields = ["title", "description", "content", "source", "topic", "summary"];

        // Require every term to appear in at least one searchable field.
        filters.$and = terms.map((term) => {
            const isWordToken = /^[a-z0-9]+$/i.test(term);
            const pattern = isWordToken ? `\\b${escapeRegExp(term)}\\b` : escapeRegExp(term);
            const regex = new RegExp(pattern, "i");
            return {
                $or: fields.map((field) => ({ [field]: regex }))
            };
        });
    }
    return filters;
}

async function getDigest(req, res) {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = parseLimit(req.query.limit);
    const skip = (page - 1) * limit;
    const filters = buildFilters(req.query);

    const cacheKey = `digest:${page}:${limit}:${req.query.q || ""}:${req.query.topic || ""}:${req.query.sentiment || ""
        }`;
    const cached = getCache(cacheKey);
    if (cached) {
        return success(res, cached);
    }

    const hasFilters = Boolean(req.query.q || req.query.topic || req.query.sentiment);
    let digest = [];
    let totalClusters = 0;

    if (hasFilters) {
        // When searching/filtering, paginate over clusters that actually have matching articles.
        const matchingArticles = await Article.find(filters)
            .sort({ publishedAt: -1 })
            .lean();

        const orderedClusterIds = [];
        const clusterArticles = new Map();

        for (const article of matchingArticles) {
            if (!article.clusterId) continue;
            const key = String(article.clusterId);
            if (!clusterArticles.has(key)) {
                clusterArticles.set(key, []);
                orderedClusterIds.push(key);
            }
            const list = clusterArticles.get(key);
            if (list.length < 5) {
                list.push(article);
            }
        }

        totalClusters = orderedClusterIds.length;
        const pageClusterIds = orderedClusterIds.slice(skip, skip + limit);

        const clusters = await Cluster.find({ _id: { $in: pageClusterIds } }).lean();
        const clusterMap = new Map(clusters.map((cluster) => [String(cluster._id), cluster]));

        digest = pageClusterIds
            .map((clusterId) => {
                const cluster = clusterMap.get(clusterId);
                if (!cluster) return null;
                return {
                    id: cluster._id,
                    clusterTitle: cluster.clusterTitle,
                    keywords: cluster.keywords,
                    sentiment: cluster.sentiment,
                    articleCount: cluster.articleIds.length,
                    articles: clusterArticles.get(clusterId) || []
                };
            })
            .filter(Boolean);
    } else {
        totalClusters = await Cluster.countDocuments();
        const clusters = await Cluster.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        for (const cluster of clusters) {
            const articles = await Article.find({ _id: { $in: cluster.articleIds } })
                .sort({ publishedAt: -1 })
                .limit(5)
                .lean();

            digest.push({
                id: cluster._id,
                clusterTitle: cluster.clusterTitle,
                keywords: cluster.keywords,
                sentiment: cluster.sentiment,
                articleCount: cluster.articleIds.length,
                articles
            });
        }
    }

    const payload = {
        data: digest,
        meta: {
            page,
            limit,
            total: totalClusters,
            hasNext: skip + limit < totalClusters
        }
    };

    setCache(cacheKey, payload);
    return success(res, payload);
}

module.exports = { getDigest };
