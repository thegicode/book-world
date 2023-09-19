import { Application } from "express";
import {
    searchNaverBook,
    librarySearch,
    bookExist,
    usageAnalysisList,
    librarySearchByBook,
    loanItemSrch,
} from "./apiHandlers";

export const setApiRoutes = (app: Application) => {
    app.get("/search-naver-book", searchNaverBook);
    app.get("/library-search", librarySearch);
    app.get("/book-exist", bookExist);
    app.get("/usage-analysis-list", usageAnalysisList);
    app.get("/library-search-by-book", librarySearchByBook);
    app.get("/popular-book", loanItemSrch);
};
