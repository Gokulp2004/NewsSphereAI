const STOPWORDS = new Set([
    "a", "an", "the", "and", "or", "but", "if", "then", "else", "when", "while",
    "of", "to", "in", "on", "for", "from", "by", "with", "about", "as", "at", "into",
    "is", "are", "was", "were", "be", "been", "being", "this", "that", "these", "those",
    "it", "its", "they", "their", "them", "he", "she", "his", "her", "you", "your",
    "we", "our", "us", "i", "me", "my", "not", "no", "yes", "do", "does", "did",
    "will", "would", "can", "could", "should", "may", "might", "up", "down", "over",
    "under", "again", "further", "more", "most", "least", "new", "said", "says"
]);

function sanitizeText(input) {
    if (!input) return "";
    const noHtml = input.replace(/<[^>]*>/g, " ");
    const noScripts = noHtml.replace(/\s+/g, " ").trim();
    return noScripts;
}

function extractSentences(text) {
    const clean = sanitizeText(text);
    if (!clean) return [];
    return clean
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 30);
}

function fallbackSummarize(text) {
    const sentences = extractSentences(text);
    if (sentences.length === 0) {
        return sanitizeText(text).slice(0, 240);
    }
    return sentences.slice(0, 2).join("\n");
}

function buildKeywords(text, limit = 5) {
    const clean = sanitizeText(text).toLowerCase();
    const tokens = clean
        .replace(/[^a-z0-9\s-]/g, " ")
        .split(/\s+/)
        .filter((t) => t.length > 2 && !STOPWORDS.has(t));

    const counts = new Map();
    tokens.forEach((token) => {
        counts.set(token, (counts.get(token) || 0) + 1);
    });

    return Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([token]) => token);
}

module.exports = {
    sanitizeText,
    extractSentences,
    fallbackSummarize,
    buildKeywords
};
