import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="glass-card rounded-3xl p-8 text-center shadow-glass">
            <h2 className="text-2xl font-display text-slate-900 dark:text-white">Page not found</h2>
            <p className="mt-2 text-sm text-muted">Return to the digest dashboard.</p>
            <Link
                to="/"
                className="mt-6 inline-flex rounded-full bg-aurora/80 px-6 py-3 text-sm font-semibold text-ink"
            >
                Back to Home
            </Link>
        </div>
    );
}
