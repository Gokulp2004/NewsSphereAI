import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
    return (
        <div className="min-h-screen text-[var(--text)]">
            <Navbar />
            <div className="mx-auto flex max-w-6xl gap-6 px-6 py-10">
                <Sidebar />
                <main className="flex-1">
                    <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glass">
                        <h1 className="text-2xl font-display text-slate-900 dark:text-white">
                            AI-Powered Multi-Source News Digest
                        </h1>
                        <p className="mt-2 text-sm text-muted">
                            Real-time clusters, sentiment insights, and intelligent summaries across the topics that matter.
                        </p>
                    </div>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
