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
exports.searchBookByWeb = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cheerio_1 = __importDefault(require("cheerio"));
const apiUtils_1 = require("./apiUtils");
const KEYBO_JSON_PATH = path_1.default.resolve("./server/kyobo.json");
function searchBookByWeb(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const bookIsbn = req.query.isbn;
            const kyoboJson = JSON.parse(fs_1.default.readFileSync(KEYBO_JSON_PATH, "utf-8"));
            if (kyoboJson.hasOwnProperty(bookIsbn)) {
                res.send(kyoboJson[bookIsbn]);
            }
            else {
                console.log("writeFile", bookIsbn);
                const href = yield getAnchorHref(req.query.isbn);
                if (!href)
                    return;
                const bookData = yield getKyoboInfoData(href);
                kyoboJson[bookIsbn] = bookData;
                fs_1.default.writeFileSync(KEYBO_JSON_PATH, JSON.stringify(kyoboJson));
                res.send(bookData);
            }
        }
        catch (error) {
            console.error(`Fail to read file, ${error}`);
        }
    });
}
exports.searchBookByWeb = searchBookByWeb;
function getAnchorHref(isbn) {
    return __awaiter(this, void 0, void 0, function* () {
        const bookContentPage = yield (0, apiUtils_1.fetchWeb)(`https://search.kyobobook.co.kr/search?keyword=${isbn}`);
        const $ = cheerio_1.default.load(bookContentPage);
        return $(".prod_link").attr("href");
    });
}
function getKyoboInfoData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const webPageContent = yield (0, apiUtils_1.fetchWeb)(url);
        const $ = cheerio_1.default.load(webPageContent);
        return $(".btn_prod_type")
            .map((index, element) => {
            return {
                prodType: $(element).find(".prod_type").text().trim(),
                prodPrice: $(element).find(".prod_price").text().trim(),
                href: $(element).attr("href"),
            };
        })
            .get();
    });
}
