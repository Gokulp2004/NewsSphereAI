const mongoose = require("mongoose");

const ClusterSchema = new mongoose.Schema(
    {
        clusterTitle: { type: String, required: true },
        keywords: [{ type: String }],
        articleIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
        sentiment: { type: String, enum: ["Positive", "Neutral", "Negative"], default: "Neutral" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cluster", ClusterSchema);
