const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        topics: [{ type: String, required: true }]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Subscription", SubscriptionSchema);
