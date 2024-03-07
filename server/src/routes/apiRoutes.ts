import { Application } from "express";

import {
    fetchBooksFromNaver,
    fetchKyoboBookInfo,
    fetchBookAvailability,
    fetchMonthlyKeywords,
    fetchLibrariesByCriteria,
    fetchPopularBooksByCriteria,
    fetchLibrariesByBookISBN,
    fetchBookUsageAnalysis,
    saveRegistrationKey,
} from "../apis";

export const setApiRoutes = (app: Application) => {
    app.get("/search-naver-book", fetchBooksFromNaver);
    app.get("/library-search", fetchLibrariesByCriteria);
    app.get("/book-exist", fetchBookAvailability);
    app.get("/usage-analysis-list", fetchBookUsageAnalysis);
    app.get("/library-search-by-book", fetchLibrariesByBookISBN);
    app.get("/popular-book", fetchPopularBooksByCriteria);
    app.get("/monthly-keywords", fetchMonthlyKeywords);
    app.get("/kyobo-book", fetchKyoboBookInfo);
    app.get("/regis-key", saveRegistrationKey);
};
