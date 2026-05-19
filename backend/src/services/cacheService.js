const NodeCache = require("node-cache");
const env = require("../config/env");

const cache = new NodeCache({ stdTTL: env.cacheTtlSeconds, checkperiod: env.cacheTtlSeconds * 0.2 });

function getCache(key) {
    return cache.get(key);
}

function setCache(key, value, ttlSeconds) {
    return cache.set(key, value, ttlSeconds || env.cacheTtlSeconds);
}

function delCache(key) {
    return cache.del(key);
}

function flushCache() {
    return cache.flushAll();
}

module.exports = { getCache, setCache, delCache, flushCache };
