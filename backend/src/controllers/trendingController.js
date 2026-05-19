const Cluster = require("../models/Cluster");
const { success } = require("../utils/response");
const { getCache, setCache } = require("../services/cacheService");

async function getTrending(req, res) {
    const cacheKey = "trending";
    const cached = getCache(cacheKey);
    if (cached) {
        return success(res, cached);
    }

    const clusters = await Cluster.aggregate([
        {
            $project: {
                clusterTitle: 1,
                keywords: 1,
                sentiment: 1,
                articleCount: { $size: "$articleIds" },
                createdAt: 1
            }
        },
        { $sort: { articleCount: -1, createdAt: -1 } },
        { $limit: 6 }
    ]);

    const payload = { data: clusters };
    setCache(cacheKey, payload);
    return success(res, payload);
}

module.exports = { getTrending };
