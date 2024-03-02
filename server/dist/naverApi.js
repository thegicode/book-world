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
exports.searchBook = exports.fetchNaver = void 0;
function fetchNaver(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const headers = {
            "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
            "X-Naver-Client-Secret": process.env.NAVER_SECRET_KEY,
        };
        const response = yield fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        return yield response.json();
    });
}
exports.fetchNaver = fetchNaver;
function searchBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const queryParams = new URLSearchParams({
            query: req.query.keyword,
            display: req.query.display,
            start: req.query.start,
            sort: req.query.sort,
        });
        const data = yield fetchNaver(`https://openapi.naver.com/v1/search/book.json?${queryParams}`);
        const { total, start, display, items } = data;
        res.send({ total, start, display, items });
    });
}
exports.searchBook = searchBook;
