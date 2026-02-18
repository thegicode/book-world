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
Object.defineProperty(exports, "__esModule", { value: true });
exports.srchBooksInLibrary = exports.getMonthlyKeywords = exports.searchPopularBooks = exports.searchLibrariesByBook = exports.getBookUsageAnalysis = exports.checkBookAvailability = exports.getLibraryDetail = exports.searchLibrariesByCriteria = void 0;
const apiUtils_1 = require("./apiUtils");
const apiErrors_1 = require("../errors/apiErrors");
const LIBRARY_API_BASE_URL = "http://data4library.kr/api";
const AUTH_KEY = process.env.LIBRARY_KEY;
const API_FORMAT = "json";
const parseURL = (apiPath, params) => {
    const queryParams = new URLSearchParams(Object.assign(Object.assign({}, params), { authKey: AUTH_KEY, format: API_FORMAT }));
    return `${LIBRARY_API_BASE_URL}/${apiPath}?${queryParams}`;
};
function searchLibrariesByCriteria(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = parseURL("libSrch", params);
        const data = yield (0, apiUtils_1.fetchData)(url);
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
exports.searchLibrariesByCriteria = searchLibrariesByCriteria;
function getLibraryDetail(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = parseURL("libSrch", params);
        const data = yield (0, apiUtils_1.fetchData)(url);
        if (!data.response || !data.response.libs || data.response.libs.length === 0)
            throw new apiErrors_1.LibraryApiError(404, "Library not found");
        return data.response.libs[0].lib;
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
        const { pageNo, pageSize, numFound, resultNum, docs } = data.response;
        const docs2 = docs.map((item) => item.doc);
        return { pageNo, pageSize, numFound, resultNum, data: docs2 };
    });
}
exports.srchBooksInLibrary = srchBooksInLibrary;
