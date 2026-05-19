
export function ClusterSkeleton() {
    return (
        <div className="glass-card animate-pulse rounded-3xl p-6 shadow-glass">
            <div className="h-4 w-32 rounded bg-white/20"></div>
            <div className="mt-4 h-6 w-3/4 rounded bg-white/20"></div>
            <div className="mt-6 h-24 rounded bg-white/10"></div>
        </div>
    );
}

export function ArticleSkeleton() {
    return (
        <div className="glass-card animate-pulse rounded-3xl p-6 shadow-glass">
            <div className="h-4 w-28 rounded bg-white/20"></div>
            <div className="mt-4 h-6 w-3/4 rounded bg-white/20"></div>
            <div className="mt-3 h-16 rounded bg-white/10"></div>
        </div>
    );
}
