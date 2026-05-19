import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate, truncate } from "../utils/format";
import SentimentBadge from "./SentimentBadge";

export default function ClusterCard({ cluster }) {
    const sources = Array.from(new Set(cluster.articles.map((a) => a.source))).slice(0, 4);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass-card rounded-3xl border border-white/10 p-6 shadow-glass"
        >
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">Cluster</p>
                    <h3 className="mt-2 text-xl font-display text-slate-900 dark:text-white">
                        {cluster.clusterTitle}
                    </h3>
                </div>
                <SentimentBadge sentiment={cluster.sentiment} />
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
                {cluster.keywords?.slice(0, 5).map((keyword) => (
                    <span key={keyword} className="rounded-full border border-white/10 px-3 py-1">
                        {keyword}
                    </span>
                ))}
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-muted">
                <Newspaper size={14} />
                <span>{cluster.articleCount} related articles</span>
            </div>

            <div className="mt-5 space-y-4">
                {cluster.articles.map((article) => (
                    <Link
                        key={article._id}
                        to={`/article/${article._id}`}
                        className="block rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
                    >
                        <div className="flex items-center justify-between text-xs text-muted">
                            <span>{article.source}</span>
                            <span>{formatDate(article.publishedAt)}</span>
                        </div>
                        <h4 className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                            {article.title}
                        </h4>
                        <p className="mt-2 text-xs text-muted">{truncate(article.summary || article.description, 140)}</p>
                    </Link>
                ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted">
                {sources.map((source) => (
                    <span key={source} className="rounded-full bg-white/10 px-3 py-1">
                        {source}
                    </span>
                ))}
            </div>
        </motion.div>
    );
}
