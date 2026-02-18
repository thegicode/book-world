import { Application } from "express";

import {
    searchNaverBook,
    searchLibraries,
    getLibraryDetail,
    checkBookExistence,
    getUsageAnalysis,
    searchLibrariesByBook,
    getPopularBooks,
    getMonthlyKeywords,
    getKyoboBookInfo,
    srchBooksInLibrary,
} from "../controllers/apiController";
import {
    validateNaverBookSearch,
    validateSearchLibraries,
    validateCheckBookExistence,
    validateGetUsageAnalysis,
    validateSearchLibrariesByBook,
    validateGetPopularBooks,
    validateGetMonthlyKeywords,
    validateKyoboBookInfo,
    validateSrchBooksInLibrary,
} from "../middleware/validationMiddleware";

const apiRoutes = (app: Application) => {
    app.get("/search-naver-book", validateNaverBookSearch, searchNaverBook);
    app.get("/api/library-search", validateSearchLibraries, searchLibraries);
    app.get("/api/library-detail", getLibraryDetail);
    app.get("/book-exist", validateCheckBookExistence, checkBookExistence);
    app.get("/usage-analysis-list", validateGetUsageAnalysis, getUsageAnalysis);
    app.get("/library-search-by-book", validateSearchLibrariesByBook, searchLibrariesByBook);
    app.get("/popular-book", validateGetPopularBooks, getPopularBooks);
    app.get("/monthly-keywords", validateGetMonthlyKeywords, getMonthlyKeywords);
    app.get("/kyobo-book", validateKyoboBookInfo, getKyoboBookInfo);
    app.get("/api/srch-books", validateSrchBooksInLibrary, srchBooksInLibrary);
};

export default apiRoutes;
