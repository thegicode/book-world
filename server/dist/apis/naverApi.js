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
exports.searchBookSideBooks = exports.searchNaverBooks = void 0;
const apiErrors_1 = require("../errors/apiErrors");
function fetchNaver(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const headers = {
            "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
            "X-Naver-Client-Secret": process.env.NAVER_SECRET_KEY,
        };
        const response = yield fetch(url, { headers });
        if (!response.ok) {
            throw new apiErrors_1.NaverApiError(response.status, response.statusText);
        }
        return response.json();
    });
}
function extractIsbn13(isbn) {
    return isbn
        .split(/\s+/)
        .find((value) => /^\d{13}$/.test(value)) || "";
}
function searchNaverBooks(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const queryParams = new URLSearchParams({
            query: params.keyword,
            display: params.display,
            start: params.start,
            sort: params.sort,
        });
        const data = yield fetchNaver(`https://openapi.naver.com/v1/search/book.json?${queryParams}`);
        const { total, start, display, items } = data;
        return { total, start, display, items };
    });
}
exports.searchNaverBooks = searchNaverBooks;
function searchBookSideBooks(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield searchNaverBooks(params);
        return {
            total: data.total,
            start: data.start,
            display: data.display,
            items: data.items.map((item) => ({
                title: item.title,
                author: item.author,
                image: item.image,
                publisher: item.publisher,
                pubdate: item.pubdate,
                isbn: item.isbn,
                isbn13: extractIsbn13(item.isbn),
                link: item.link,
            })),
        };
    });
}
exports.searchBookSideBooks = searchBookSideBooks;
