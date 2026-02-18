"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.srchBooksInLibrary = exports.getMonthlyKeywords = exports.getPopularBooks = exports.searchLibrariesByBook = exports.getUsageAnalysis = exports.checkBookExistence = exports.getLibraryDetail = exports.searchLibraries = exports.getKyoboBookInfo = exports.searchNaverBook = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const BookService = __importStar(require("../apis"));
exports.searchNaverBook = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { keyword, display, start, sort } = req.query;
    const books = yield BookService.searchNaverBooks({
        keyword: keyword,
        display: display,
        start: start,
        sort: sort,
    });
    res.status(200).json({ status: "success", data: books });
}));
exports.getKyoboBookInfo = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { isbn } = req.query;
    const bookInfo = yield BookService.getKyoboBookInfoByIsbn(isbn);
    res.status(200).json({ status: "success", data: bookInfo });
}));
exports.searchLibraries = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { dtl_region, page, pageSize } = req.query;
    const libraries = yield BookService.searchLibrariesByCriteria({
        dtl_region: dtl_region,
        page: page,
        pageSize: pageSize,
    });
    res.status(200).json({ status: "success", data: libraries });
}));
exports.getLibraryDetail = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { libCode } = req.query;
    const library = yield BookService.getLibraryDetail({ libCode: libCode });
    res.status(200).json({ status: "success", data: library });
}));
exports.checkBookExistence = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { isbn13, libCode } = req.query;
    const result = yield BookService.checkBookAvailability({
        isbn13: isbn13,
        libCode: libCode,
    });
    res.status(200).json({ status: "success", data: result });
}));
exports.getUsageAnalysis = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { isbn13 } = req.query;
    const analysis = yield BookService.getBookUsageAnalysis({ isbn13: isbn13 });
    res.status(200).json({ status: "success", data: analysis });
}));
exports.searchLibrariesByBook = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { isbn, region, dtl_region } = req.query;
    const libraries = yield BookService.searchLibrariesByBook({
        isbn: isbn,
        region: region,
        dtl_region: dtl_region,
    });
    res.status(200).json({ status: "success", data: libraries });
}));
exports.getPopularBooks = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.query, { startDt, endDt, pageNo, pageSize } = _a, optionalParams = __rest(_a, ["startDt", "endDt", "pageNo", "pageSize"]);
    const books = yield BookService.searchPopularBooks({
        startDt: startDt,
        endDt: endDt,
        pageNo: pageNo,
        pageSize: pageSize,
        gender: optionalParams.gender || '',
        age: optionalParams.age || '',
        region: optionalParams.region || '',
        addCode: optionalParams.addCode || '',
        kdc: optionalParams.kdc || '',
    });
    res.status(200).json({ status: "success", data: books });
}));
exports.getMonthlyKeywords = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { month } = req.query;
    const keywords = yield BookService.getMonthlyKeywords({ month: month });
    res.status(200).json({ status: "success", data: keywords });
}));
exports.srchBooksInLibrary = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { libCode, keyword, pageNo, pageSize } = req.query;
    const books = yield BookService.srchBooksInLibrary({
        libCode,
        keyword,
        pageNo,
        pageSize,
    });
    res.status(200).json({ status: "success", data: books });
}));
