const vader = require("vader-sentiment");
const { sanitizeText } = require("../utils/text");

function analyzeSentiment(text) {
    const clean = sanitizeText(text || "");
    if (!clean) return "Neutral";
    const score = vader.SentimentIntensityAnalyzer.polarity_scores(clean).compound;
    if (score >= 0.2) return "Positive";
    if (score <= -0.2) return "Negative";
    return "Neutral";
}

module.exports = { analyzeSentiment };
