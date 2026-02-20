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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.srchBooksInLibrary = exports.getMonthlyKeywords = exports.searchPopularBooks = exports.searchLibrariesByBook = exports.getBookUsageAnalysis = exports.checkBookAvailability = exports.getLibraryDetail = exports.searchLibrariesByKeyword = void 0;
__exportStar(require("./naverApi"), exports);
__exportStar(require("./kyoboApi"), exports);
var libraryApi_1 = require("./libraryApi");
Object.defineProperty(exports, "searchLibrariesByKeyword", { enumerable: true, get: function () { return libraryApi_1.searchLibrariesByKeyword; } });
Object.defineProperty(exports, "getLibraryDetail", { enumerable: true, get: function () { return libraryApi_1.getLibraryDetail; } });
Object.defineProperty(exports, "checkBookAvailability", { enumerable: true, get: function () { return libraryApi_1.checkBookAvailability; } });
Object.defineProperty(exports, "getBookUsageAnalysis", { enumerable: true, get: function () { return libraryApi_1.getBookUsageAnalysis; } });
Object.defineProperty(exports, "searchLibrariesByBook", { enumerable: true, get: function () { return libraryApi_1.searchLibrariesByBook; } });
Object.defineProperty(exports, "searchPopularBooks", { enumerable: true, get: function () { return libraryApi_1.searchPopularBooks; } });
Object.defineProperty(exports, "getMonthlyKeywords", { enumerable: true, get: function () { return libraryApi_1.getMonthlyKeywords; } });
Object.defineProperty(exports, "srchBooksInLibrary", { enumerable: true, get: function () { return libraryApi_1.srchBooksInLibrary; } });
