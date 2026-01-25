"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerKey = exports.getKyoboBookInfo = exports.getMonthlyKeywords = exports.getPopularBooks = exports.searchLibrariesByBook = exports.getUsageAnalysis = exports.checkBookExistence = exports.searchLibraries = exports.searchNaverBook = void 0;
const apis_1 = require("../apis");
const searchNaverBook = (req, res) => {
    (0, apis_1.fetchBooksFromNaver)(req, res);
};
exports.searchNaverBook = searchNaverBook;
const searchLibraries = (req, res) => {
    (0, apis_1.fetchLibrariesByCriteria)(req, res);
};
exports.searchLibraries = searchLibraries;
const checkBookExistence = (req, res) => {
    (0, apis_1.fetchBookAvailability)(req, res);
};
exports.checkBookExistence = checkBookExistence;
const getUsageAnalysis = (req, res) => {
    (0, apis_1.fetchBookUsageAnalysis)(req, res);
};
exports.getUsageAnalysis = getUsageAnalysis;
const searchLibrariesByBook = (req, res) => {
    (0, apis_1.fetchLibrariesByBookISBN)(req, res);
};
exports.searchLibrariesByBook = searchLibrariesByBook;
const getPopularBooks = (req, res) => {
    (0, apis_1.fetchPopularBooksByCriteria)(req, res);
};
exports.getPopularBooks = getPopularBooks;
const getMonthlyKeywords = (req, res) => {
    (0, apis_1.fetchMonthlyKeywords)(req, res);
};
exports.getMonthlyKeywords = getMonthlyKeywords;
const getKyoboBookInfo = (req, res) => {
    (0, apis_1.fetchKyoboBookInfo)(req, res);
};
exports.getKyoboBookInfo = getKyoboBookInfo;
const registerKey = (req, res) => {
    (0, apis_1.saveRegistrationKey)(req, res);
};
exports.registerKey = registerKey;
