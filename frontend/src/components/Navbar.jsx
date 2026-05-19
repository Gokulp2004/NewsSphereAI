import { BarChart3, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-slate/80">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <NavLink to="/" className="flex items-center gap-3 text-lg font-semibold text-slate-900 dark:text-white">
                    <span className="rounded-full bg-aurora/30 p-2 text-slate-900 dark:text-white">
                        <Sparkles size={18} />
                    </span>
                    <span className="font-display">NewsSphere AI</span>
                </NavLink>
                <nav className="flex items-center gap-6 text-sm text-slate-700 dark:text-white/80">
                    <NavLink to="/" className="hover:text-slate-900 dark:hover:text-white">
                        Home
                    </NavLink>
                    <NavLink to="/analytics" className="flex items-center gap-2 hover:text-slate-900 dark:hover:text-white">
                        <BarChart3 size={16} />
                        Analytics
                    </NavLink>
                    <ThemeToggle />
                </nav>
            </div>
        </header>
    );
}
