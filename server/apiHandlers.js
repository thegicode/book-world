"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.regisKey = exports.monthlyKeywords = exports.loanItemSrch = exports.librarySearchByBook = exports.usageAnalysisList = exports.bookExist = exports.librarySearch = exports.searchKyoboBook = exports.searchNaverBook = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const naverApi_1 = require("./naverApi");
const kyoboApi_1 = require("./kyoboApi");
const libraryApi_1 = require("./libraryApi");
const searchNaverBook = (req, res) => (0, naverApi_1.searchBook)(req, res);
exports.searchNaverBook = searchNaverBook;
const searchKyoboBook = (req, res) => (0, kyoboApi_1.searchBookByWeb)(req, res);
exports.searchKyoboBook = searchKyoboBook;
const librarySearch = (req, res) => (0, libraryApi_1.searchOpenLibrary)(req, res);
exports.librarySearch = librarySearch;
const bookExist = (req, res) => (0, libraryApi_1.getExistBookInfo)(req, res);
exports.bookExist = bookExist;
const usageAnalysisList = (req, res) => (0, libraryApi_1.usageAnalysis)(req, res);
exports.usageAnalysisList = usageAnalysisList;
const librarySearchByBook = (req, res) => (0, libraryApi_1.searchLibraryOfBook)(req, res);
exports.librarySearchByBook = librarySearchByBook;
const loanItemSrch = (req, res) => (0, libraryApi_1.getPopularBooks)(req, res);
exports.loanItemSrch = loanItemSrch;
const monthlyKeywords = (req, res) => (0, libraryApi_1.getKeysords)(req, res);
exports.monthlyKeywords = monthlyKeywords;
const regisKey = (req, res) => {
    const ENV_PATH = path_1.default.resolve("./server/.env.key");
    try {
        const key = req.query.key.replace(/aaaaa/g, "\n");
        fs_1.default.writeFileSync(ENV_PATH, key);
        res.send(true);
    }
    catch (error) {
        res.send(false);
        console.error(`Fail to read file, ${error}`);
    }
};
exports.regisKey = regisKey;
