const Subscription = require("../models/Subscription");
const { success } = require("../utils/response");

async function subscribe(req, res) {
    const { email, topics } = req.body;

    const subscription = await Subscription.findOneAndUpdate(
        { email },
        { $set: { topics } },
        { new: true, upsert: true }
    );

    res.status(201);
    return success(res, { data: subscription, message: "Subscription saved" });
}

module.exports = { subscribe };
