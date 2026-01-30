"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiController_1 = require("../controllers/apiController");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const apiRoutes = (app) => {
    app.get("/search-naver-book", validationMiddleware_1.validateNaverBookSearch, apiController_1.searchNaverBook);
    app.get("/library-search", validationMiddleware_1.validateSearchLibraries, apiController_1.searchLibraries);
    app.get("/book-exist", validationMiddleware_1.validateCheckBookExistence, apiController_1.checkBookExistence);
    app.get("/usage-analysis-list", validationMiddleware_1.validateGetUsageAnalysis, apiController_1.getUsageAnalysis);
    app.get("/library-search-by-book", validationMiddleware_1.validateSearchLibrariesByBook, apiController_1.searchLibrariesByBook);
    app.get("/popular-book", validationMiddleware_1.validateGetPopularBooks, apiController_1.getPopularBooks);
    app.get("/monthly-keywords", validationMiddleware_1.validateGetMonthlyKeywords, apiController_1.getMonthlyKeywords);
    app.get("/kyobo-book", validationMiddleware_1.validateKyoboBookInfo, apiController_1.getKyoboBookInfo);
    app.get("/regis-key", validationMiddleware_1.validateRegisterKey, apiController_1.registerKey);
};
exports.default = apiRoutes;
