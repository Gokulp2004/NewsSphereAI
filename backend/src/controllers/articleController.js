const Article = require("../models/Article");
const Cluster = require("../models/Cluster");
const { success, error } = require("../utils/response");

async function getArticle(req, res) {
    const article = await Article.findById(req.params.id).lean();
    if (!article) {
        return error(res, { status: 404, message: "Article not found" });
    }

    let cluster = null;
    if (article.clusterId) {
        cluster = await Cluster.findById(article.clusterId).lean();
    }

    return success(res, { data: { ...article, cluster } });
}

module.exports = { getArticle };
