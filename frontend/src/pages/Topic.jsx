import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ArticleCard from "../components/ArticleCard";
import ErrorState from "../components/ErrorState";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import { ArticleSkeleton } from "../components/Skeletons";
import api from "../services/api";

export default function Topic() {
    const { name } = useParams();
    const [articles, setArticles] = useState([]);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        const fetchTopic = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/api/topic/${name}`, {
                    params: { page, limit: 8, q: query }
                });
                if (!mounted) return;
                const payload = response.data;
                setArticles(payload.data || []);
                const total = payload.meta?.total || 0;
                setTotalPages(Math.max(Math.ceil(total / 8), 1));
                setError(null);
            } catch (err) {
                if (mounted) setError("Unable to load topic articles.");
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchTopic();
        return () => {
            mounted = false;
        };
    }, [name, page, query]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-display text-slate-900 dark:text-white">Topic: {name}</h2>
                <div className="w-full max-w-md">
                    <SearchBar value={query} onChange={setQuery} onSubmit={() => setPage(1)} />
                </div>
            </div>

            {error && <ErrorState message={error} />}

            <div className="grid gap-6 md:grid-cols-2">
                {loading && articles.length === 0 && (
                    <>
                        <ArticleSkeleton />
                        <ArticleSkeleton />
                    </>
                )}
                {articles.map((article) => (
                    <ArticleCard key={article._id} article={article} />
                ))}
            </div>

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
}
