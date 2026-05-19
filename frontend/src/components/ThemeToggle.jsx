import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-white/60 px-3 py-2 text-sm text-slate-800 shadow-glass transition hover:bg-white/80 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
        </button>
    );
}
