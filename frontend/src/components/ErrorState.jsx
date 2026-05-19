import { AlertTriangle } from "lucide-react";

export default function ErrorState({ message }) {
    return (
        <div className="glass-card rounded-3xl p-6 text-center text-slate-900 shadow-glass dark:text-white">
            <AlertTriangle className="mx-auto mb-3" size={24} />
            <p className="text-sm text-muted">{message || "Something went wrong."}</p>
        </div>
    );
}
