import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Analytics from "./pages/Analytics";
import ArticleDetails from "./pages/ArticleDetails";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Topic from "./pages/Topic";

export default function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/topic/:name" element={<Topic />} />
                <Route path="/article/:id" element={<ArticleDetails />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}
