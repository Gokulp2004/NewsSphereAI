
export default function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-8 flex items-center justify-center gap-3 text-sm text-slate-900 dark:text-white">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="rounded-full border border-white/20 px-4 py-2 disabled:opacity-40"
            >
                Prev
            </button>
            <span className="text-muted">
                Page {page} of {totalPages}
            </span>
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="rounded-full border border-white/20 px-4 py-2 disabled:opacity-40"
            >
                Next
            </button>
        </div>
    );
}
