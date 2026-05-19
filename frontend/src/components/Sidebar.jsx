import { Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../services/api";
import { TOPICS } from "../utils/constants";

export default function Sidebar() {
    const [trending, setTrending] = useState([]);

    useEffect(() => {
        let mounted = true;
        api
            .get("/api/trending")
            .then((res) => {
                if (mounted) setTrending(res.data?.data || []);
            })
            .catch(() => {
                if (mounted) setTrending([]);
            });
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <aside className="hidden w-64 flex-shrink-0 lg:block">
            <div className="glass-card rounded-3xl p-6 shadow-glass">
                <h3 className="mb-4 text-xs uppercase tracking-[0.2em] text-muted">Topics</h3>
                <div className="flex flex-col gap-2 text-sm">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `rounded-xl px-3 py-2 transition ${isActive
                                ? "bg-white/60 text-slate-900 dark:bg-white/20 dark:text-white"
                                : "text-muted hover:bg-white/20"
                            }`
                        }
                    >
                        All Stories
                    </NavLink>
                    {TOPICS.map((topic) => (
                        <NavLink
                            key={topic}
                            to={`/topic/${topic}`}
                            className={({ isActive }) =>
                                `rounded-xl px-3 py-2 transition ${isActive
                                    ? "bg-white/60 text-slate-900 dark:bg-white/20 dark:text-white"
                                    : "text-muted hover:bg-white/20"
                                }`
                            }
                        >
                            {topic}
                        </NavLink>
                    ))}
                </div>
            </div>

            <div className="glass-card mt-6 rounded-3xl p-6 shadow-glass">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                    <Flame size={16} />
                    Trending Clusters
                </div>
                <div className="space-y-3 text-sm text-muted">
                    {trending.length === 0 && <p>No trends yet.</p>}
                    {trending.map((cluster) => (
                        <div key={cluster._id || cluster.clusterTitle}>
                            <p className="text-slate-900 dark:text-white/90">{cluster.clusterTitle}</p>
                            <p className="text-xs text-muted">
                                {cluster.keywords?.slice(0, 3).join(" ") || "keywords"}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
