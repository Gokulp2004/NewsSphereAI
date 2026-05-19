import { SENTIMENT_STYLES } from "../utils/constants";

export default function SentimentBadge({ sentiment }) {
    const style = SENTIMENT_STYLES[sentiment] || SENTIMENT_STYLES.Neutral;
    return (
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${style}`}>
            {sentiment}
        </span>
    );
}
