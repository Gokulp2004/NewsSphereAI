function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry(fn, options = {}) {
    const retries = options.retries ?? 3;
    const baseDelayMs = options.baseDelayMs ?? 500;
    const factor = options.factor ?? 2;

    let lastError;
    for (let attempt = 0; attempt <= retries; attempt += 1) {
        try {
            return await fn(attempt + 1);
        } catch (error) {
            lastError = error;
            if (attempt >= retries) {
                break;
            }
            const delay = baseDelayMs * Math.pow(factor, attempt);
            await wait(delay);
        }
    }

    throw lastError;
}

module.exports = { withRetry };
