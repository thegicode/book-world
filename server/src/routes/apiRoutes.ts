import { Application } from "express";

import {
    searchNaverBook,
    searchLibraries,
    checkBookExistence,
    getUsageAnalysis,
    searchLibrariesByBook,
    getPopularBooks,
    getMonthlyKeywords,
    getKyoboBookInfo,
    registerKey,
} from "../controllers/apiController";

const apiRoutes = (app: Application) => {
    app.get("/search-naver-book", searchNaverBook);
    app.get("/library-search", searchLibraries);
    app.get("/book-exist", checkBookExistence);
    app.get("/usage-analysis-list", getUsageAnalysis);
    app.get("/library-search-by-book", searchLibrariesByBook);
    app.get("/popular-book", getPopularBooks);
    app.get("/monthly-keywords", getMonthlyKeywords);
    app.get("/kyobo-book", getKyoboBookInfo);
    app.get("/regis-key", registerKey);
};

export default apiRoutes;
