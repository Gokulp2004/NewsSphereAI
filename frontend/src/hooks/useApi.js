import { useCallback, useState } from "react";

export function useApi(requestFn) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const run = useCallback(
        async (...args) => {
            try {
                setLoading(true);
                setError(null);
                const response = await requestFn(...args);
                setData(response);
                return response;
            } catch (err) {
                setError(err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [requestFn]
    );

    return { data, loading, error, run };
}
