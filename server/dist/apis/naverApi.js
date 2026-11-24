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
const kakaoApi_1 = require("./kakaoApi");
function extractIsbn13(isbn) {
    return isbn.split(/\s+/).find((value) => /^\d{13}$/.test(value)) || "";
}
function searchNaverBooks(params) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, kakaoApi_1.searchKakaoBooks)(params);
    });
}
exports.searchNaverBooks = searchNaverBooks;
function searchBookSideBooks(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield (0, kakaoApi_1.searchKakaoBooks)(params);
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
