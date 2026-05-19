export function formatDate(value) {
    if (!value) return "";
    const date = new Date(value);
    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(date);
}

export function truncate(text, length = 140) {
    if (!text) return "";
    if (text.length <= length) return text;
    return `${text.slice(0, length)}...`;
}
