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
import {
    validateNaverBookSearch,
    validateSearchLibraries,
    validateCheckBookExistence,
    validateGetUsageAnalysis,
    validateSearchLibrariesByBook,
    validateGetPopularBooks,
    validateGetMonthlyKeywords,
    validateKyoboBookInfo,
    validateRegisterKey,
} from "../middleware/validationMiddleware";

const apiRoutes = (app: Application) => {
    app.get("/search-naver-book", validateNaverBookSearch, searchNaverBook);
    app.get("/library-search", validateSearchLibraries, searchLibraries);
    app.get("/book-exist", validateCheckBookExistence, checkBookExistence);
    app.get("/usage-analysis-list", validateGetUsageAnalysis, getUsageAnalysis);
    app.get("/library-search-by-book", validateSearchLibrariesByBook, searchLibrariesByBook);
    app.get("/popular-book", validateGetPopularBooks, getPopularBooks);
    app.get("/monthly-keywords", validateGetMonthlyKeywords, getMonthlyKeywords);
    app.get("/kyobo-book", validateKyoboBookInfo, getKyoboBookInfo);
    app.get("/regis-key", validateRegisterKey, registerKey);
};

export default apiRoutes;
