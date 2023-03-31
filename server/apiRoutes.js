"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupApiRoutes = void 0;
const apiHandlers_1 = require("./apiHandlers");
const setupApiRoutes = (app) => {
    app.get("/search-naver-book", apiHandlers_1.searchNaverBook);
    app.get("/library-search", apiHandlers_1.librarySearch);
    app.get("/book-exist", apiHandlers_1.bookExist);
    app.get("/usage-analysis-list", apiHandlers_1.usageAnalysisList);
    app.get("/library-search-by-book", apiHandlers_1.librarySearchByBook);
};
exports.setupApiRoutes = setupApiRoutes;
