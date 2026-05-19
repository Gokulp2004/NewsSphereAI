import { useState } from "react";
import api from "../services/api";
import { TOPICS } from "../utils/constants";

export default function Subscribe() {
    const [email, setEmail] = useState("");
    const [topics, setTopics] = useState([]);
    const [status, setStatus] = useState(null);

    const toggleTopic = (topic) => {
        setTopics((prev) =>
            prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
        );
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setStatus(null);
        try {
            await api.post("/api/subscribe", { email, topics });
            setStatus("Subscribed successfully.");
        } catch (err) {
            setStatus("Subscription failed. Try again.");
        }
    };

    return (
        <div className="glass-card rounded-3xl p-8 shadow-glass">
            <h2 className="text-2xl font-display text-slate-900 dark:text-white">Stay in the loop</h2>
            <p className="mt-2 text-sm text-muted">
                Subscribe to your favorite topics and receive curated summaries.
            </p>

            <form className="mt-6 space-y-6" onSubmit={onSubmit}>
                <div>
                    <label className="text-xs uppercase tracking-[0.2em] text-muted">Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/70 px-4 py-3 text-sm text-slate-900 outline-none dark:bg-white/10 dark:text-white"
                        placeholder="you@domain.com"
                    />
                </div>

                <div>
                    <label className="text-xs uppercase tracking-[0.2em] text-muted">Topics</label>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {TOPICS.map((topic) => (
                            <label
                                key={topic}
                                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-700 dark:text-white/80"
                            >
                                <input
                                    type="checkbox"
                                    checked={topics.includes(topic)}
                                    onChange={() => toggleTopic(topic)}
                                    className="h-4 w-4"
                                />
                                {topic}
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="rounded-full bg-aurora/80 px-6 py-3 text-sm font-semibold text-ink transition hover:bg-aurora"
                >
                    Subscribe
                </button>

                {status && <p className="text-sm text-muted">{status}</p>}
            </form>
        </div>
    );
}
