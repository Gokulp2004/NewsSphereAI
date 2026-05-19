import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
    timeout: 12000
});

api.interceptors.request.use((config) => {
    const apiKey = import.meta.env.VITE_API_KEY;
    if (apiKey) {
        config.headers["x-api-key"] = apiKey;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);

export default api;
