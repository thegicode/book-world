import { Application } from "express";

import {
    searchKakaoBook,
    searchBookSideBooks,
    getLibraryDetail,
    checkBookExistence,
    checkBookSideAvailabilityBatch,
    getUsageAnalysis,
    searchLibrariesByBook,
    getPopularBooks,
    getMonthlyKeywords,
    getKyoboBookInfo,
    srchBooksInLibrary,
    searchLibrariesByKeyword,
    searchBookSideLibraries,
} from "../controllers/apiController";
import {
    validateKakaoBookSearch,
    validateCheckBookExistence,
    validateCheckBookAvailabilityBatch,
    validateGetUsageAnalysis,
    validateSearchLibrariesByBook,
    validateGetPopularBooks,
    validateGetMonthlyKeywords,
    validateKyoboBookInfo,
    validateSrchBooksInLibrary,
    validateSearchLibrariesByKeyword,
} from "../middleware/validationMiddleware";

const apiRoutes = (app: Application) => {
    app.get("/search-kakao-book", validateKakaoBookSearch, searchKakaoBook);
    app.get("/api/book-side/books", validateKakaoBookSearch, searchBookSideBooks);
    app.get("/api/book-side/libraries", validateSearchLibrariesByKeyword, searchBookSideLibraries);
    app.get("/api/book-side/availability", validateCheckBookAvailabilityBatch, checkBookSideAvailabilityBatch);
    app.get("/api/library-search-by-keyword", validateSearchLibrariesByKeyword, searchLibrariesByKeyword);
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
