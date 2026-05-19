const Article = require("../models/Article");
const env = require("../config/env");
const { success } = require("../utils/response");

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

async function getTopicNews(req, res) {
    const topic = (req.params.name || "").trim();
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = parseLimit(req.query.limit);
    const skip = (page - 1) * limit;

    const query = { topic: new RegExp(`^${escapeRegExp(topic)}$`, "i") };
    if (req.query.q) {
        const terms = tokenizeQuery(req.query.q);
        const fields = ["title", "description", "content", "source", "topic", "summary"];
        query.$and = terms.map((term) => {
            const isWordToken = /^[a-z0-9]+$/i.test(term);
            const pattern = isWordToken ? `\\b${escapeRegExp(term)}\\b` : escapeRegExp(term);
            const regex = new RegExp(pattern, "i");
            return {
                $or: fields.map((field) => ({ [field]: regex }))
            };
        });
    }

    const total = await Article.countDocuments(query);
    const articles = await Article.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    return success(res, {
        data: articles,
        meta: {
            page,
            limit,
            total,
            hasNext: skip + limit < total
        }
    });
}

module.exports = { getTopicNews };
