import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, onSubmit }) {
    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit?.();
            }}
            className="flex w-full items-center gap-3 rounded-2xl border border-white/20 bg-white/70 px-4 py-3 text-sm text-slate-900 shadow-glass dark:bg-white/10 dark:text-white"
        >
            <Search size={16} />
            <input
                value={value}
                onChange={(event) => onChange?.(event.target.value)}
                className="w-full bg-transparent outline-none placeholder:text-slate-400 dark:placeholder:text-white/40"
                placeholder="Search topics, sources, or keywords"
            />
        </form>
    );
}
