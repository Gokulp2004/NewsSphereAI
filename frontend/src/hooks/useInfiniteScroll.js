import { useEffect, useRef } from "react";

export function useInfiniteScroll(onLoadMore, hasMore, loading) {
    const sentinelRef = useRef(null);

    useEffect(() => {
        if (!hasMore || loading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        onLoadMore();
                    }
                });
            },
            { rootMargin: "200px" }
        );

        const target = sentinelRef.current;
        if (target) observer.observe(target);

        return () => {
            if (target) observer.unobserve(target);
        };
    }, [onLoadMore, hasMore, loading]);

    return sentinelRef;
}
