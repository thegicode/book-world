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
exports.fetchMonthlyKeywords = exports.fetchPopularBooksByCriteria = exports.fetchLibrariesByBookISBN = exports.fetchBookUsageAnalysis = exports.fetchBookAvailability = exports.fetchLibrariesByCriteria = void 0;
const apiUtils_1 = require("./apiUtils");
const LIBRARY_API_BASE_URL = "http://data4library.kr/api";
const AUTH_KEY = process.env.LIBRARY_KEY;
const API_FORMAT = "json";
const parseURL = (apiPath, params) => {
    const queryParams = new URLSearchParams(Object.assign(Object.assign({}, params), { authKey: AUTH_KEY, format: API_FORMAT }));
    return `${LIBRARY_API_BASE_URL}/${apiPath}?${queryParams}`;
};
function fetchLibrariesByCriteria(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = parseURL("libSrch", {
            dtl_region: req.query.dtl_region,
            pageNo: req.query.page,
            pageSize: req.query.pageSize,
        });
        try {
            const data = yield (0, apiUtils_1.fetchData)(url);
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
            res.status(500).send("Failed to get library search data");
        }
    });
}
exports.fetchLibrariesByCriteria = fetchLibrariesByCriteria;
function fetchBookAvailability(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const url = parseURL("bookExist", {
            isbn13: req.query.isbn13,
            libCode: req.query.libCode,
        });
        try {
            const data = yield (0, apiUtils_1.fetchData)(url);
            const result = (_a = data.response) === null || _a === void 0 ? void 0 : _a.result;
            res.send(result);
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Failed to check book exist data");
        }
    });
}
exports.fetchBookAvailability = fetchBookAvailability;
function fetchBookUsageAnalysis(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = parseURL("usageAnalysisList", {
            isbn13: req.query.isbn13,
            loaninfoYN: "Y",
        });
        try {
            const data = yield (0, apiUtils_1.fetchData)(url);
            if (!data || !data.response)
                return;
            const { book, loanHistory, loanGrps, keywords, coLoanBooks, maniaRecBooks, readerRecBooks, } = data.response;
            res.send({
                book,
                loanHistory: loanHistory &&
                    loanHistory.map((item) => item.loan),
                loanGrps: loanGrps &&
                    loanGrps
                        .slice(0, 5)
                        .map((item) => item.loanGrp),
                keywords: keywords &&
                    keywords.map((item) => item.keyword),
                coLoanBooks: coLoanBooks &&
                    coLoanBooks.slice(0, 5).map((item) => item.book),
                maniaRecBooks: maniaRecBooks &&
                    maniaRecBooks.slice(0, 5).map((item) => item.book),
                readerRecBooks: readerRecBooks &&
                    readerRecBooks.slice(0, 5).map((item) => item.book),
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Failed to get usage analysis list data");
        }
    });
}
exports.fetchBookUsageAnalysis = fetchBookUsageAnalysis;
function fetchLibrariesByBookISBN(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { isbn, region, dtl_region } = req.query;
        if (typeof isbn !== "string" ||
            typeof region !== "string" ||
            typeof dtl_region !== "string") {
            return res.status(400).send("Invalid or missing query parameters.");
        }
        const url = parseURL("libSrchByBook", {
            isbn,
            region,
            dtl_region,
        });
        try {
            const data = yield (0, apiUtils_1.fetchData)(url, { method: "GET" });
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
exports.fetchLibrariesByBookISBN = fetchLibrariesByBookISBN;
function fetchPopularBooksByCriteria(req, res) {
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
        const url = parseURL("loanItemSrch", {
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
            const data = yield (0, apiUtils_1.fetchData)(url, { method: "GET" });
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
exports.fetchPopularBooksByCriteria = fetchPopularBooksByCriteria;
function fetchMonthlyKeywords(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = parseURL("monthlyKeywords", {
            month: req.query.month,
        });
        try {
            const data = yield (0, apiUtils_1.fetchData)(url);
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
exports.fetchMonthlyKeywords = fetchMonthlyKeywords;
