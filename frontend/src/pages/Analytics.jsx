import { AlertCircle, Filter, Loader, Search, TrendingUp, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Analytics() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [flatArticles, setFlatArticles] = useState([]);
    const [filters, setFilters] = useState({ sentiment: null, source: null, topic: null });
    const [searchTerm, setSearchTerm] = useState("");

    const sourceOptions = useMemo(
        () => Array.from(new Set(flatArticles.map((a) => a.source || "Unknown"))).sort((a, b) => a.localeCompare(b)),
        [flatArticles]
    );

    const topicOptions = useMemo(
        () => Array.from(new Set(flatArticles.map((a) => a.topic || "Other"))).sort((a, b) => a.localeCompare(b)),
        [flatArticles]
    );

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            // Fetch digest to analyze articles
            const response = await api.get("/api/digest?limit=100");
            const articles = response.data.data;

            if (articles.length === 0) {
                setStats(null);
                setLoading(false);
                return;
            }

            // Calculate statistics
            const sentiments = { Positive: 0, Neutral: 0, Negative: 0 };
            const sources = {};
            const topics = {};
            let totalArticles = 0;

            articles.forEach((cluster) => {
                cluster.articles?.forEach((article) => {
                    totalArticles++;
                    // Count sentiments
                    const sentiment = article.sentiment || "Neutral";
                    sentiments[sentiment] = (sentiments[sentiment] || 0) + 1;

                    // Count sources
                    const source = article.source || "Unknown";
                    sources[source] = (sources[source] || 0) + 1;

                    // Count topics
                    const topic = article.topic || "Other";
                    topics[topic] = (topics[topic] || 0) + 1;
                });
            });

            // Get top sources and topics
            const topSources = Object.entries(sources)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([name, count]) => ({ name, count }));

            const topTopics = Object.entries(topics)
                .sort((a, b) => b[1] - a[1])
                .map(([name, count]) => ({ name, count }));

            setFlatArticles(
                articles.reduce((acc, cluster) => {
                    const list = (cluster.articles || []).map((a) => ({ ...a, clusterTitle: cluster.clusterTitle }));
                    return acc.concat(list);
                }, [])
            );

            setStats({
                totalArticles,
                totalClusters: articles.length,
                sentiments,
                topSources,
                topTopics,
            });
        } catch (err) {
            setError("Failed to load analytics");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading)
        return (
            <div className="flex items-center justify-center py-20">
                <Loader className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );

    if (!stats)
        return (
            <div className="text-center py-20 text-slate-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                <p>No data available yet. Check back after news ingestion.</p>
            </div>
        );

    const totalSentiments = Object.values(stats.sentiments).reduce((a, b) => a + b, 0);
    const sentimentPercentages = {
        Positive: Math.round((stats.sentiments.Positive / totalSentiments) * 100),
        Neutral: Math.round((stats.sentiments.Neutral / totalSentiments) * 100),
        Negative: Math.round((stats.sentiments.Negative / totalSentiments) * 100),
    };

    const hasActiveFilters = Boolean(filters.sentiment || filters.source || filters.topic || searchTerm.trim());

    const clearAllFilters = () => {
        setFilters({ sentiment: null, source: null, topic: null });
        setSearchTerm("");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <TrendingUp className="text-blue-500" />
                    News Analytics Dashboard
                </h1>
                <p className="text-slate-600 dark:text-white/60">Real-time insights from your news feed</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg p-6 border border-blue-200/50 dark:border-blue-800/50">
                    <p className="text-sm text-slate-600 dark:text-white/70 font-medium">Total Articles</p>
                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-2">{stats.totalArticles}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 rounded-lg p-6 border border-purple-200/50 dark:border-purple-800/50">
                    <p className="text-sm text-slate-600 dark:text-white/70 font-medium">Clusters</p>
                    <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 mt-2">{stats.totalClusters}</p>
                </div>
            </div>

            {/* Sentiment Distribution */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Sentiment Distribution</h2>
                <div className="space-y-4">
                    {/* Positive */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Positive</span>
                            <span className="text-sm font-semibold text-slate-700 dark:text-white">
                                {stats.sentiments.Positive} ({sentimentPercentages.Positive}%)
                            </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-emerald-500 dark:bg-emerald-600"
                                style={{ width: `${sentimentPercentages.Positive}%` }}
                            />
                        </div>
                    </div>
                    {/* Neutral */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Neutral</span>
                            <span className="text-sm font-semibold text-slate-700 dark:text-white">
                                {stats.sentiments.Neutral} ({sentimentPercentages.Neutral}%)
                            </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-amber-400 dark:bg-amber-600"
                                style={{ width: `${sentimentPercentages.Neutral}%` }}
                            />
                        </div>
                    </div>
                    {/* Negative */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-rose-600 dark:text-rose-400">Negative</span>
                            <span className="text-sm font-semibold text-slate-700 dark:text-white">
                                {stats.sentiments.Negative} ({sentimentPercentages.Negative}%)
                            </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-rose-500 h-full rounded-full"
                                style={{ width: `${sentimentPercentages.Negative}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>



            {/* Topic Distribution */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Topic Distribution</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {stats.topTopics.map((topic, idx) => (
                        <div
                            key={idx}
                            className="text-left bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600"
                        >
                            <p className="text-sm font-medium text-slate-600 dark:text-white/70 capitalize">{topic.name}</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{topic.count}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* User-Friendly Filters */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Filter size={18} />
                        Filter Articles
                    </h2>
                    <button
                        onClick={clearAllFilters}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-sm text-slate-700 dark:text-white"
                    >
                        Reset
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="lg:col-span-2 relative">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Search in title, source, topic"
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-9 py-2.5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400"
                        />
                    </div>

                    <select
                        value={filters.source || ""}
                        onChange={(event) => setFilters((prev) => ({ ...prev, source: event.target.value || null }))}
                        className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-800 dark:text-white"
                    >
                        <option value="">All Sources</option>
                        {sourceOptions.map((source) => (
                            <option key={source} value={source}>
                                {source}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.topic || ""}
                        onChange={(event) => setFilters((prev) => ({ ...prev, topic: event.target.value || null }))}
                        className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-800 dark:text-white"
                    >
                        <option value="">All Topics</option>
                        {topicOptions.map((topic) => (
                            <option key={topic} value={topic}>
                                {topic}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-slate-600 dark:text-slate-300 mr-2">Sentiment:</span>
                    {[
                        { value: "Positive", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                        { value: "Neutral", cls: "bg-amber-50 text-amber-700 border-amber-200" },
                        { value: "Negative", cls: "bg-rose-50 text-rose-700 border-rose-200" },
                    ].map((item) => (
                        <button
                            key={item.value}
                            onClick={() =>
                                setFilters((prev) => ({
                                    ...prev,
                                    sentiment: prev.sentiment === item.value ? null : item.value,
                                }))
                            }
                            className={`px-3 py-1.5 rounded-full border text-sm transition ${filters.sentiment === item.value
                                    ? `${item.cls} ring-2 ring-offset-1 ring-slate-300`
                                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                                }`}
                        >
                            {item.value}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-slate-600 dark:text-slate-300 mr-2">Active:</span>
                    {!hasActiveFilters && <span className="text-sm text-slate-400">None</span>}

                    {filters.sentiment && (
                        <button
                            onClick={() => setFilters((prev) => ({ ...prev, sentiment: null }))}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs"
                        >
                            {filters.sentiment}
                            <X size={12} />
                        </button>
                    )}

                    {filters.source && (
                        <button
                            onClick={() => setFilters((prev) => ({ ...prev, source: null }))}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs"
                        >
                            {filters.source}
                            <X size={12} />
                        </button>
                    )}

                    {filters.topic && (
                        <button
                            onClick={() => setFilters((prev) => ({ ...prev, topic: null }))}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs"
                        >
                            {filters.topic}
                            <X size={12} />
                        </button>
                    )}

                    {searchTerm.trim() && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs"
                        >
                            {searchTerm.trim()}
                            <X size={12} />
                        </button>
                    )}
                </div>
            </div>

            {/* Filtered Results */}
            <div className="flex flex-col gap-4">
                <FilteredList flatArticles={flatArticles} filters={filters} searchTerm={searchTerm} />
            </div>
            {/* Refresh Button */}
            <div className="flex justify-center">
                <button
                    onClick={fetchAnalytics}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                    Refresh Analytics
                </button>
            </div>
        </div>
    );
}

function FilteredList({ flatArticles, filters, searchTerm }) {
    const filtered = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return (flatArticles || []).filter((a) => {
            if (filters.sentiment && a.sentiment !== filters.sentiment) return false;
            if (filters.source && (a.source || "Unknown") !== filters.source) return false;
            if (filters.topic && (a.topic || "Other") !== filters.topic) return false;
            if (normalizedSearch) {
                const haystack = `${a.title || ""} ${a.source || ""} ${a.topic || ""} ${a.summary || ""}`.toLowerCase();
                if (!haystack.includes(normalizedSearch)) return false;
            }
            return true;
        });
    }, [flatArticles, filters, searchTerm]);

    if (!filtered || filtered.length === 0) {
        return <div className="text-sm text-slate-500">No matching articles.</div>;
    }

    return (
        <div className="space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-300">Showing {Math.min(filtered.length, 12)} of {filtered.length} matching articles</p>
            {filtered.slice(0, 12).map((a) => (
                <div key={a._id || a.url} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700">
                    <div>
                        <Link to={`/article/${a._id}`} className="font-medium text-slate-900 dark:text-white hover:underline">
                            {a.title}
                        </Link>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{a.source} • {a.topic} • {new Date(a.publishedAt).toLocaleString()}</div>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">{a.sentiment}</div>
                </div>
            ))}
        </div>
    );
}
