import { Link } from "react-router-dom";
import { formatDate, truncate } from "../utils/format";
import SentimentBadge from "./SentimentBadge";

export default function ArticleCard({ article }) {
    return (
        <Link to={`/article/${article._id}`} className="glass-card block rounded-3xl p-5 shadow-glass">
            <div className="flex items-center justify-between text-xs text-muted">
                <span>{article.source}</span>
                <span>{formatDate(article.publishedAt)}</span>
            </div>
            <h3 className="mt-3 text-lg font-display text-slate-900 dark:text-white">{article.title}</h3>
            <p className="mt-2 text-sm text-muted">{truncate(article.description, 160)}</p>
            <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted">{article.topic}</span>
                <SentimentBadge sentiment={article.sentiment} />
            </div>
        </Link>
    );
}
