const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        content: { type: String },
        source: { type: String },
        url: { type: String, required: true },
        urlHash: { type: String, required: true, unique: true },
        image: { type: String },
        publishedAt: { type: Date },
        author: { type: String },
        topic: { type: String },
        sentiment: { type: String, enum: ["Positive", "Neutral", "Negative"], default: "Neutral" },
        summary: { type: String },
        clusterId: { type: mongoose.Schema.Types.ObjectId, ref: "Cluster", default: null }
    },
    { timestamps: true }
);

ArticleSchema.index({ topic: 1, publishedAt: -1 });
ArticleSchema.index({ urlHash: 1 }, { unique: true });

module.exports = mongoose.model("Article", ArticleSchema);
