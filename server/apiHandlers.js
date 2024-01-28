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
exports.monthlyKeywords = exports.loanItemSrch = exports.librarySearchByBook = exports.usageAnalysisList = exports.bookExist = exports.librarySearch = exports.searchKyoboBook = exports.searchNaverBook = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const cheerio_1 = __importDefault(require("cheerio"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, ".env.key") });
const { LIBRARY_KEY, NAVER_CLIENT_ID, NAVER_SECRET_KEY } = process.env;
const fetchData = (url, headers) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(url, { headers });
    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return yield response.json();
});
function fetchWeb(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const html = yield response.text();
            return html;
        }
        catch (error) {
            console.error("Error fetching web page:", error);
            throw error;
        }
    });
}
function searchNaverBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { keyword, display, start, sort } = req.query;
        const queryParams = new URLSearchParams({
            query: keyword,
            display: display,
            start: start,
            sort: sort,
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
function searchKyoboBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const bookIsbn = req.query.isbn;
            const koyboURL = path_1.default.resolve("./server/kyobo.json");
            const kyoboJson = JSON.parse(fs_1.default.readFileSync(koyboURL, "utf-8"));
            if (kyoboJson.hasOwnProperty(bookIsbn)) {
                res.send(kyoboJson[bookIsbn]);
            }
            else {
                console.log("writeFile", koyboURL);
                const href = yield getAnchorHref();
                if (!href)
                    return;
                const bookData = yield getKyoboInfoData(href);
                kyoboJson[bookIsbn] = bookData;
                fs_1.default.writeFileSync(koyboURL, JSON.stringify(kyoboJson));
                res.send(bookData);
            }
        }
        catch (error) {
            console.error(`Fail to read file, ${error}`);
        }
        function getAnchorHref() {
            return __awaiter(this, void 0, void 0, function* () {
                const bookContentPage = yield fetchWeb(`https://search.kyobobook.co.kr/search?keyword=${req.query.isbn}`);
                const $ = cheerio_1.default.load(bookContentPage);
                return $(".prod_link").attr("href");
            });
        }
        function getKyoboInfoData(url) {
            return __awaiter(this, void 0, void 0, function* () {
                const webPageContent = yield fetchWeb(url);
                const $ = cheerio_1.default.load(webPageContent);
                return $(".btn_prod_type")
                    .map((index, element) => {
                    const prodType = $(element).find(".prod_type").text().trim();
                    const prodPrice = $(element).find(".prod_price").text().trim();
                    const href = $(element).attr("href");
                    const data = {
                        prodType,
                        prodPrice,
                        href,
                    };
                    return data;
                })
                    .get();
            });
        }
    });
}
exports.searchKyoboBook = searchKyoboBook;
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
            const { book, loanHistory, loanGrps, keywords, coLoanBooks, maniaRecBooks, readerRecBooks, } = data.response;
            const loanHistoryItems = loanHistory.map((item) => item.loan);
            const loanGrpsItems = loanGrps
                .slice(0, 5)
                .map((item) => item.loanGrp);
            const keywordsItems = keywords.map((item) => item.keyword);
            const coLoanBookItems = coLoanBooks
                .slice(0, 5)
                .map((item) => item.book);
            const maniaRecBookItems = maniaRecBooks
                .slice(0, 5)
                .map((item) => item.book);
            const readerRecBookItems = readerRecBooks
                .slice(0, 5)
                .map((item) => item.book);
            res.send({
                book,
                loanHistory: loanHistoryItems,
                loanGrps: loanGrpsItems,
                keywords: keywordsItems,
                coLoanBooks: coLoanBookItems,
                maniaRecBooks: maniaRecBookItems,
                readerRecBooks: readerRecBookItems,
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
        if (typeof isbn !== "string" ||
            typeof region !== "string" ||
            typeof dtl_region !== "string") {
            return res.status(400).send("Invalid or missing query parameters.");
        }
        const url = buildLibraryApiUrl("libSrchByBook", {
            isbn,
            region,
            dtl_region,
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
function loanItemSrch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { startDt, endDt, gender, age, region, addCode, kdc, pageNo, pageSize, } = req.query;
        if (typeof startDt !== "string" ||
            typeof endDt !== "string" ||
            typeof gender !== "string" ||
            typeof age !== "string" ||
            typeof region !== "string" ||
            typeof addCode !== "string" ||
            typeof kdc !== "string" ||
            typeof pageNo !== "string" ||
            typeof pageSize !== "string") {
            return res.status(400).send("Invalid or missing query parameters.");
        }
        const url = buildLibraryApiUrl("loanItemSrch", {
            startDt,
            endDt,
            gender,
            age,
            region,
            addCode,
            kdc,
            pageNo,
            pageSize,
        });
        try {
            const data = yield fetchData(url, { method: "GET" });
            const { resultNum, docs } = data.response;
            const docs2 = docs.map((item) => item.doc);
            res.send({ resultNum, data: docs2 });
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Failed to get library data");
        }
    });
}
exports.loanItemSrch = loanItemSrch;
function monthlyKeywords(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = buildLibraryApiUrl("monthlyKeywords", {
            month: req.query.month,
        });
        try {
            const data = yield fetchData(url);
            const { keywords, request, resultNum } = data.response;
            res.send({
                keywords: keywords.map((keyword) => keyword.keyword),
                request,
                resultNum,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Failed to get library search data");
        }
    });
}
exports.monthlyKeywords = monthlyKeywords;
