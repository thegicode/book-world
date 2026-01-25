"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiController_1 = require("../controllers/apiController");
const apiRoutes = (app) => {
    app.get("/search-naver-book", apiController_1.searchNaverBook);
    app.get("/library-search", apiController_1.searchLibraries);
    app.get("/book-exist", apiController_1.checkBookExistence);
    app.get("/usage-analysis-list", apiController_1.getUsageAnalysis);
    app.get("/library-search-by-book", apiController_1.searchLibrariesByBook);
    app.get("/popular-book", apiController_1.getPopularBooks);
    app.get("/monthly-keywords", apiController_1.getMonthlyKeywords);
    app.get("/kyobo-book", apiController_1.getKyoboBookInfo);
    app.get("/regis-key", apiController_1.registerKey);
};
exports.default = apiRoutes;
