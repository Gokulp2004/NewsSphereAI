const { OpenAI } = require("openai");
const env = require("../config/env");
const { fallbackSummarize } = require("../utils/text");
const { logger } = require("../utils/logger");

const client = env.openaiApiKey ? new OpenAI({ apiKey: env.openaiApiKey }) : null;

async function summarizeArticle(text) {
    const input = text || "";
    if (!input.trim()) {
        return "";
    }

    if (!client) {
        return fallbackSummarize(input);
    }

    try {
        const prompt =
            "Summarize this news article in exactly 2 concise lines for a news digest application.";
        const response = await client.chat.completions.create({
            model: env.openaiModel,
            messages: [
                { role: "system", content: "You are a precise news summarizer." },
                { role: "user", content: `${prompt}\n\nArticle:\n${input}` }
            ],
            temperature: 0.3,
            max_tokens: 120
        });

        const content = response.choices?.[0]?.message?.content?.trim();
        if (!content) {
            return fallbackSummarize(input);
        }

        return content
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
            .slice(0, 2)
            .join("\n");
    } catch (error) {
        logger.warn("OpenAI summarization failed", error.message || error);
        return fallbackSummarize(input);
    }
}

module.exports = { summarizeArticle };
