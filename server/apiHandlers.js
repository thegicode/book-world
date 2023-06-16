"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.librarySearchByBook = exports.usageAnalysisList = exports.bookExist = exports.librarySearch = exports.searchNaverBook = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, ".env.key") });
const { LIBRARY_KEY, NAVER_CLIENT_ID, NAVER_SECRET_KEY } = process.env;
const fetchData = (url, headers) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(url, { headers });
    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return yield response.json();
});
function searchNaverBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { keyword, display, start } = req.query;
        const queryParams = new URLSearchParams({
            query: keyword,
            display: display,
            start: start,
        });
        const headers = {
            "X-Naver-Client-Id": NAVER_CLIENT_ID,
            "X-Naver-Client-Secret": NAVER_SECRET_KEY,
        };
        const url = `https://openapi.naver.com/v1/search/book.json?${queryParams}`;
        try {
            const data = yield fetchData(url, headers);
            const { total, start, display, items } = data;
            res.send({ total, start, display, items });
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Failed to get books from Naver");
        }
    });
}
exports.searchNaverBook = searchNaverBook;
const buildLibraryApiUrl = (apiPath, params) => {
    const queryParams = new URLSearchParams(Object.assign(Object.assign({}, params), { authKey: LIBRARY_KEY, format: "json" }));
    return `http://data4library.kr/api/${apiPath}?${queryParams}`;
};
function librarySearch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { dtl_region, page, pageSize } = req.query;
        const url = buildLibraryApiUrl("libSrch", {
            dtl_region: dtl_region,
            pageNo: page,
            pageSize: pageSize,
        });
        try {
            const data = yield fetchData(url);
            const { pageNo, pageSize, numFound, resultNum, libs } = data.response;
            const formattedData = {
                pageNo,
                pageSize,
                numFound,
                resultNum,
                libraries: libs.map((item) => item.lib),
            };
            res.send(formattedData);
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Failed to get library search data");
        }
    });
}
exports.librarySearch = librarySearch;
function bookExist(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { isbn13, libCode } = req.query;
        const url = buildLibraryApiUrl("bookExist", {
            isbn13: isbn13,
            libCode: libCode,
        });
        try {
            const data = yield fetchData(url);
            const result = (_a = data.response) === null || _a === void 0 ? void 0 : _a.result;
            res.send(result);
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Failed to check book exist data");
        }
    });
}
exports.bookExist = bookExist;
function usageAnalysisList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { isbn13 } = req.query;
        const url = buildLibraryApiUrl("usageAnalysisList", {
            isbn13: isbn13,
            loaninfoYN: "Y",
        });
        try {
            const data = yield fetchData(url);
            const { book, loanHistory, loanGrps, keywords, recBooks, coLoanBooks } = data.response;
            const loanHistoryItems = loanHistory.map((item) => item.loan);
            const loanGrpsItems = loanGrps.map((item) => item.loanGrp);
            const keywordsItems = keywords.map((item) => item.keyword);
            res.send({
                book,
                loanHistory: loanHistoryItems,
                loanGrps: loanGrpsItems,
                keywords: keywordsItems,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Failed to get usage analysis list data");
        }
    });
}
exports.usageAnalysisList = usageAnalysisList;
function librarySearchByBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { isbn, region, dtl_region } = req.query;
        const url = buildLibraryApiUrl("libSrchByBook", {
            isbn: isbn,
            region: region,
            dtl_region: dtl_region,
        });
        try {
            const data = yield fetchData(url, { method: "GET" });
            const { pageNo, pageSize, numFound, resultNum, libs } = data.response;
            res.send({
                pageNo,
                pageSize,
                numFound,
                resultNum,
                libraries: libs.map((item) => item.lib),
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Failed to get library data");
        }
    });
}
exports.librarySearchByBook = librarySearchByBook;
