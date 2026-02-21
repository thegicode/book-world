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
exports.srchBooksInLibrary = exports.getMonthlyKeywords = exports.searchPopularBooks = exports.searchLibrariesByBook = exports.getBookUsageAnalysis = exports.checkBookAvailability = exports.getLibraryDetail = exports.searchLibrariesByKeyword = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const apiUtils_1 = require("./apiUtils");
const apiErrors_1 = require("../errors/apiErrors");
const config_1 = require("../config");
const LIBRARY_API_BASE_URL = "http://data4library.kr/api";
const AUTH_KEY = process.env.LIBRARY_KEY;
const API_FORMAT = "json";
const CACHE_DIR = path_1.default.join(config_1.rootDirectoryPath, "server/data");
const CACHE_FILE = path_1.default.join(CACHE_DIR, "libraries.json");
const parseURL = (apiPath, params) => {
    const queryParams = new URLSearchParams(Object.assign(Object.assign({}, params), { authKey: AUTH_KEY, format: API_FORMAT }));
    return `${LIBRARY_API_BASE_URL}/${apiPath}?${queryParams}`;
};
const ensureCacheDir = () => {
    if (!fs_1.default.existsSync(CACHE_DIR)) {
        fs_1.default.mkdirSync(CACHE_DIR, { recursive: true });
    }
};
const fetchAndCacheLibraries = () => __awaiter(void 0, void 0, void 0, function* () {
    const countUrl = parseURL("libSrch", { pageNo: "1", pageSize: "1" });
    const countData = yield (0, apiUtils_1.fetchData)(countUrl);
    if (!countData.response)
        throw new Error("Invalid API response for count");
    const totalCount = countData.response.numFound;
    const allUrl = parseURL("libSrch", { pageNo: "1", pageSize: String(totalCount) });
    const allData = yield (0, apiUtils_1.fetchData)(allUrl);
    if (!allData.response || !allData.response.libs)
        throw new Error("Invalid API response for all libraries");
    const libraries = allData.response.libs.map((item) => item.lib);
    ensureCacheDir();
    fs_1.default.writeFileSync(CACHE_FILE, JSON.stringify(libraries, null, 2));
    return libraries;
});
function searchLibrariesByKeyword(params) {
    return __awaiter(this, void 0, void 0, function* () {
        let libraries = [];
        if (fs_1.default.existsSync(CACHE_FILE)) {
            const fileContent = fs_1.default.readFileSync(CACHE_FILE, "utf-8");
            libraries = JSON.parse(fileContent);
        }
        else {
            libraries = yield fetchAndCacheLibraries();
        }
        const filtered = libraries.filter(lib => lib.libName.includes(params.keyword));
        const page = parseInt(params.page, 10);
        const pageSize = parseInt(params.pageSize, 10);
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginated = filtered.slice(start, end);
        return {
            pageNo: params.page,
            pageSize: params.pageSize,
            numFound: filtered.length,
            resultNum: paginated.length,
            libraries: paginated,
        };
    });
}
exports.searchLibrariesByKeyword = searchLibrariesByKeyword;
function getLibraryDetail(params) {
    return __awaiter(this, void 0, void 0, function* () {
        let libraries = [];
        if (fs_1.default.existsSync(CACHE_FILE)) {
            const fileContent = fs_1.default.readFileSync(CACHE_FILE, "utf-8");
            libraries = JSON.parse(fileContent);
        }
        else {
            libraries = yield fetchAndCacheLibraries();
        }
        const library = libraries.find(lib => lib.libCode === params.libCode);
        if (!library) {
            throw new apiErrors_1.LibraryApiError(404, "Library not found");
        }
        return library;
    });
}
exports.getLibraryDetail = getLibraryDetail;
function checkBookAvailability(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = parseURL("bookExist", params);
        const data = yield (0, apiUtils_1.fetchData)(url);
        if (!data.response)
            throw new apiErrors_1.LibraryApiError(502, "Invalid API response from library server");
        return data.response.result;
    });
}
exports.checkBookAvailability = checkBookAvailability;
function getBookUsageAnalysis(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = parseURL("usageAnalysisList", Object.assign(Object.assign({}, params), { loaninfoYN: "Y" }));
        const data = yield (0, apiUtils_1.fetchData)(url);
        if (!data.response)
            throw new apiErrors_1.LibraryApiError(502, "Invalid API response from library server");
        const { book, loanHistory, loanGrps, keywords, coLoanBooks, maniaRecBooks, readerRecBooks, } = data.response;
        return {
            book,
            loanHistory: (loanHistory === null || loanHistory === void 0 ? void 0 : loanHistory.map((item) => item.loan)) || [],
            loanGrps: (loanGrps === null || loanGrps === void 0 ? void 0 : loanGrps.slice(0, 5).map((item) => item.loanGrp)) ||
                [],
            keywords: (keywords === null || keywords === void 0 ? void 0 : keywords.map((item) => item.keyword)) || [],
            coLoanBooks: (coLoanBooks === null || coLoanBooks === void 0 ? void 0 : coLoanBooks.slice(0, 5).map((item) => item.book)) || [],
            maniaRecBooks: (maniaRecBooks === null || maniaRecBooks === void 0 ? void 0 : maniaRecBooks.slice(0, 5).map((item) => item.book)) || [],
            readerRecBooks: (readerRecBooks === null || readerRecBooks === void 0 ? void 0 : readerRecBooks.slice(0, 5).map((item) => item.book)) ||
                [],
        };
    });
}
exports.getBookUsageAnalysis = getBookUsageAnalysis;
function searchLibrariesByBook(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = parseURL("libSrchByBook", params);
        const data = yield (0, apiUtils_1.fetchData)(url, { method: "GET" });
        if (!data.response)
            throw new apiErrors_1.LibraryApiError(502, "Invalid API response from library server");
        const { pageNo, pageSize, numFound, resultNum, libs } = data.response;
        return {
            pageNo,
            pageSize,
            numFound,
            resultNum,
            libraries: libs.map((item) => item.lib),
        };
    });
}
exports.searchLibrariesByBook = searchLibrariesByBook;
function searchPopularBooks(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = parseURL("loanItemSrch", params);
        const data = yield (0, apiUtils_1.fetchData)(url, { method: "GET" });
        if (!data.response)
            throw new apiErrors_1.LibraryApiError(502, "Invalid API response from library server");
        const { resultNum, docs } = data.response;
        const docs2 = docs.map((item) => item.doc);
        return { resultNum, data: docs2 };
    });
}
exports.searchPopularBooks = searchPopularBooks;
function getMonthlyKeywords(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = parseURL("monthlyKeywords", params);
        const data = yield (0, apiUtils_1.fetchData)(url);
        if (!data.response)
            throw new apiErrors_1.LibraryApiError(502, "Invalid API response from library server");
        const { keywords, request, resultNum } = data.response;
        return {
            keywords: keywords.map((keyword) => keyword.keyword),
            request,
            resultNum,
        };
    });
}
exports.getMonthlyKeywords = getMonthlyKeywords;
function srchBooksInLibrary(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const title = params.keyword.replace(/\s+/g, "");
        const searchParams = {
            libCode: params.libCode,
            pageNo: params.pageNo,
            pageSize: params.pageSize,
            title,
        };
        const url = parseURL("srchBooks", searchParams);
        const data = yield (0, apiUtils_1.fetchData)(url, { method: "GET" });
        if (!data.response)
            throw new apiErrors_1.LibraryApiError(502, "Invalid API response from library server");
        const { pageNo, pageSize, numFound, docs } = data.response;
        const docs2 = docs.map((item) => item.doc);
        const availabilityPromises = docs2.map((book) => __awaiter(this, void 0, void 0, function* () {
            try {
                const availability = yield checkBookAvailability({
                    isbn13: book.isbn13,
                    libCode: params.libCode,
                });
                return Object.assign(Object.assign({}, book), availability);
            }
            catch (error) {
                console.error(`Failed to check availability for book ${book.isbn13}`, error);
                return null;
            }
        }));
        const booksWithAvailability = yield Promise.all(availabilityPromises);
        const ownedBooks = booksWithAvailability.filter((book) => book !== null && book.hasBook === 'Y');
        return { pageNo, pageSize, numFound, resultNum: ownedBooks.length, data: ownedBooks };
    });
}
exports.srchBooksInLibrary = srchBooksInLibrary;
