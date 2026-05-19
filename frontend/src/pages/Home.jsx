import { useCallback, useEffect, useState } from "react";
import ClusterCard from "../components/ClusterCard";
import ErrorState from "../components/ErrorState";
import SearchBar from "../components/SearchBar";
import { ClusterSkeleton } from "../components/Skeletons";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import api from "../services/api";

export default function Home() {
    const [clusters, setClusters] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState("");

    const fetchDigest = useCallback(
        async (targetPage, replace = false) => {
            try {
                setLoading(true);
                const response = await api.get("/api/digest", {
                    params: { page: targetPage, limit: 6, q: query }
                });
                const payload = response.data;
                setClusters((prev) => (replace ? payload.data : [...prev, ...payload.data]));
                setHasNext(payload.meta?.hasNext ?? false);
                setError(null);
            } catch (err) {
                setError("Unable to load digest.");
            } finally {
                setLoading(false);
            }
        },
        [query]
    );

    useEffect(() => {
        setPage(1);
        fetchDigest(1, true);
    }, [fetchDigest]);

    const loadMore = useCallback(() => {
        if (loading || !hasNext) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchDigest(nextPage);
    }, [page, hasNext, loading, fetchDigest]);

    const sentinelRef = useInfiniteScroll(loadMore, hasNext, loading);

    return (
        <div className="space-y-6">
            <SearchBar
                value={query}
                onChange={setQuery}
                onSubmit={() => {
                    setPage(1);
                    fetchDigest(1, true);
                }}
            />

            {error && <ErrorState message={error} />}

            <div className="grid gap-6 lg:grid-cols-2">
                {clusters.map((cluster) => (
                    <ClusterCard key={cluster.id} cluster={cluster} />
                ))}
                {loading && clusters.length === 0 && (
                    <>
                        <ClusterSkeleton />
                        <ClusterSkeleton />
                    </>
                )}
            </div>

            <div ref={sentinelRef} />
            {loading && clusters.length > 0 && (
                <p className="text-center text-xs text-muted">Loading more clusters...</p>
            )}
            {!hasNext && clusters.length > 0 && (
                <p className="text-center text-xs text-muted">You are all caught up.</p>
            )}
        </div>
    );
}
