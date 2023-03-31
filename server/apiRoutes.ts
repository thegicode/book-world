import { Application } from "express";
import {
    searchNaverBook,
    librarySearch,
    bookExist,
    usageAnalysisList,
    librarySearchByBook,
} from "./apiHandlers";

export const setupApiRoutes = (app: Application) => {
    app.get("/search-naver-book", searchNaverBook);
    app.get("/library-search", librarySearch);
    app.get("/book-exist", bookExist);
    app.get("/usage-analysis-list", usageAnalysisList);
    app.get("/library-search-by-book", librarySearchByBook);
};
