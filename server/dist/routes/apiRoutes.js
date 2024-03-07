"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setApiRoutes = void 0;
const apis_1 = require("../apis");
const setApiRoutes = (app) => {
    app.get("/search-naver-book", apis_1.fetchBooksFromNaver);
    app.get("/library-search", apis_1.fetchLibrariesByCriteria);
    app.get("/book-exist", apis_1.fetchBookAvailability);
    app.get("/usage-analysis-list", apis_1.fetchBookUsageAnalysis);
    app.get("/library-search-by-book", apis_1.fetchLibrariesByBookISBN);
    app.get("/popular-book", apis_1.fetchPopularBooksByCriteria);
    app.get("/monthly-keywords", apis_1.fetchMonthlyKeywords);
    app.get("/kyobo-book", apis_1.fetchKyoboBookInfo);
    app.get("/regis-key", apis_1.saveRegistrationKey);
};
exports.setApiRoutes = setApiRoutes;
