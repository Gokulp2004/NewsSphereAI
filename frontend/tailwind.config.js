/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                display: ["Iowan Old Style", "Palatino Linotype", "serif"],
                body: ["Avenir Next", "Segoe UI", "sans-serif"]
            },
            colors: {
                ink: "#0c1117",
                cloud: "#f5f7fb",
                aurora: "#71d0c9",
                ember: "#ff7a6e",
                slate: "#121a23",
                glass: "rgba(255, 255, 255, 0.14)"
            },
            backgroundImage: {
                mesh: "radial-gradient(circle at 20% 20%, rgba(113, 208, 201, 0.35), transparent 55%), radial-gradient(circle at 80% 0%, rgba(255, 122, 110, 0.35), transparent 45%), radial-gradient(circle at 20% 80%, rgba(124, 92, 255, 0.15), transparent 45%)"
            },
            boxShadow: {
                glow: "0 20px 60px rgba(12, 17, 23, 0.2)",
                glass: "0 10px 30px rgba(5, 10, 16, 0.3)"
            }
        }
    },
    plugins: []
};
