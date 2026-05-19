import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorState from "../components/ErrorState";
import SentimentBadge from "../components/SentimentBadge";
import api from "../services/api";
import { formatDate } from "../utils/format";

export default function ArticleDetails() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        api
            .get(`/api/article/${id}`)
            .then((res) => {
                if (mounted) setArticle(res.data?.data || null);
            })
            .catch(() => {
                if (mounted) setError("Unable to load article details.");
            });
        return () => {
            mounted = false;
        };
    }, [id]);

    if (error) return <ErrorState message={error} />;
    if (!article) return null;

    return (
        <div className="space-y-6">
            <div className="glass-card rounded-3xl p-8 shadow-glass">
                <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted">
                    <span>{article.source}</span>
                    <span>{formatDate(article.publishedAt)}</span>
                </div>
                <h2 className="mt-4 text-3xl font-display text-slate-900 dark:text-white">{article.title}</h2>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                    <SentimentBadge sentiment={article.sentiment} />
                    <span className="text-xs text-muted">{article.topic}</span>
                </div>
                {article.image && (
                    <img
                        src={article.image}
                        alt={article.title}
                        className="mt-6 w-full rounded-3xl border border-white/10 object-cover"
                    />
                )}
                <p className="mt-6 text-sm text-slate-700 dark:text-white/80 whitespace-pre-line">
                    {article.summary}
                </p>
                <p className="mt-4 text-sm text-muted whitespace-pre-line">{article.content}</p>
                <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-sm text-aurora"
                >
                    Read original article <ExternalLink size={16} />
                </a>
            </div>

            {article.cluster && (
                <div className="glass-card rounded-3xl p-6 shadow-glass">
                    <h3 className="text-xl font-display text-slate-900 dark:text-white">Cluster Insight</h3>
                    <p className="mt-2 text-sm text-muted">{article.cluster.clusterTitle}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
                        {article.cluster.keywords?.map((keyword) => (
                            <span key={keyword} className="rounded-full border border-white/10 px-3 py-1">
                                {keyword}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
