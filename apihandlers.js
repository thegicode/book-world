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
exports.librarySearchByBook = exports.usageAnalysisList = exports.bookExist = exports.librarySearch = exports.searchNaverBook = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, ".env.key") });
const { LIBRARY_KEY, NAVER_CLIENT_ID, NAVER_SECRET_KEY } = process.env;
/** NAVER */
// 키워드 검색
function searchNaverBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { keyword, display, start } = req.query;
        const queryParams = new URLSearchParams({
            query: keyword,
            display: display,
            start: start,
        });
        const headers = {
            "X-Naver-Client-Id": NAVER_CLIENT_ID,
            "X-Naver-Client-Secret": NAVER_SECRET_KEY,
        };
        const url = `https://openapi.naver.com/v1/search/book.json?${queryParams}`;
        try {
            const response = yield fetch(url, { headers });
            if (!response.ok) {
                throw new Error(`Failed to get books from Naver: ${response.statusText}`);
            }
            const data = yield response.json();
            const { total, start, display, items } = data;
            res.send({ total, start, display, items });
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Failed to get books from Naver");
        }
    });
}
exports.searchNaverBook = searchNaverBook;
/** 도서관 정보나루 */
const host = "http://data4library.kr/api";
const authKey = `authKey=${LIBRARY_KEY}`;
const formatType = "json";
// 정보공개 도서관 조회
function librarySearch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { dtl_region, page, pageSize } = req.query;
        const queryParams = new URLSearchParams({
            dtl_region: dtl_region,
            pageNo: page,
            pageSize: pageSize,
            format: formatType,
        });
        const url = `${host}/libSrch?${authKey}&${queryParams}`;
        try {
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to get library search data: ${response.statusText}`);
            }
            const data = yield response.json();
            const { pageNo, pageSize, numFound, resultNum, libs } = data.response;
            const formattedData = {
                pageNo,
                pageSize,
                numFound,
                resultNum,
                libraries: libs.map((item) => item.lib),
            };
            res.send(formattedData);
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Failed to get library search data");
        }
    });
}
exports.librarySearch = librarySearch;
// 지정 도서관, 책 소장 & 대출 가능 여부
function bookExist(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { isbn13, libCode } = req.query;
        const queryParams = new URLSearchParams({
            isbn13: isbn13,
            libCode: libCode,
            format: formatType,
        });
        const url = `${host}/bookExist?${authKey}&${queryParams}`;
        try {
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to check book exist data: ${response.statusText}`);
            }
            const data = yield response.json();
            const result = (_a = data.response) === null || _a === void 0 ? void 0 : _a.result;
            // console.log(result)
            res.send(result);
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Failed to check book exist data");
        }
    });
}
exports.bookExist = bookExist;
// 도서별 이용 분석
function usageAnalysisList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { isbn13 } = req.query;
        const params = new URLSearchParams({
            isbn13: isbn13,
            loaninfoYN: "Y",
            format: formatType,
        });
        const url = `${host}/usageAnalysisList?${authKey}&${params}`;
        try {
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to get usage analysis list data: ${response.statusText} `);
            }
            const data = yield response.json();
            const { book, loanHistory, loanGrps, keywords, recBooks, coLoanBooks } = data.response;
            const loanHistoryItems = loanHistory.map((item) => item.loan);
            const loanGrpsItems = loanGrps.map((item) => item.loanGrp);
            const keywordsItems = keywords.map((item) => item.keyword);
            const recBooksItems = recBooks.map((item) => item.book);
            const coLoanBooksItems = coLoanBooks.map((item) => item.book);
            res.send({
                book,
                loanHistory: loanHistoryItems,
                loanGrps: loanGrpsItems,
                keywords: keywordsItems,
                recBooks: recBooksItems,
                coLoanBooks: coLoanBooksItems,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Failed to get usage analysis list data");
        }
    });
}
exports.usageAnalysisList = usageAnalysisList;
// 도서 소장 도서관 조회
function librarySearchByBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { isbn, region, dtl_region } = req.query;
        const params = new URLSearchParams({
            isbn: isbn,
            region: region,
            dtl_region: dtl_region,
            format: formatType,
        });
        const url = `${host}/libSrchByBook?${authKey}&${params}`;
        try {
            const response = yield fetch(url, { method: "GET" });
            if (!response.ok) {
                throw new Error(`Failed to get library data: ${response.statusText}`);
            }
            const data = yield response.json();
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
exports.librarySearchByBook = librarySearchByBook;
// module.exports = {
//     searchNaverBook,
//     librarySearch,
//     bookExist,
//     usageAnalysisList,
//     librarySearchByBook,
// };
// export function searchNaverBook(arg0: string, searchNaverBook: any) {
//     throw new Error("Function not implemented.");
// }
// export function librarySearch(arg0: string, librarySearch: any) {
//     throw new Error("Function not implemented.");
// }
// export function bookExist(arg0: string, bookExist: any) {
//     throw new Error("Function not implemented.");
// }
// export function usageAnalysisList(arg0: string, usageAnalysisList: any) {
//     throw new Error("Function not implemented.");
// }
// export function librarySearchByBook(arg0: string, librarySearchByBook: any) {
//     throw new Error("Function not implemented.");
// }
// export function searchNaverBook(arg0: string, searchNaverBook: any) {
//     throw new Error("Function not implemented.");
// }
// 111007 고덕도서관
// 도서관별 장서/대출 데이터 조회
// app.get('/library-itemSrch', function(req, res) {
//     const { libCode, keyword } = req.query
//     // console.log(keyword, libCode)
//     const lib = `libCode=${libCode}`
//     const keywordStr = `keyword=${encodeURIComponent(keyword)}`
//     const url = `${host}/srchBooks?${authKey}&keyword=%EC%97%AD%EC%82%AC&pageNo=1&pageSize=10&format=json`
//     // console.log(url)
//     axios.get(url)
//         .then( response => {
//             res.send(response.data.response.docs)
//         })
//         .catch(error => {
//             console.error(error)
//         })
// });
// 도서 상세 조회
// app.get('/srchDtlList', function(req, res) {
//     const { isbn13 } = req.query
//     const url = `${host}/srchDtlList?${authKey}&isbn13=${isbn13}&loaninfoYN=Y&format=json`
//     // console.log(url)
//     axios.get(url)
//         .then( response => {
//             const { detail, loanInfo, request} = response.data.response
//             const data = {
//                 detail: detail[0].book,
//                 loanInfo,
//                 loanInfoYN: request.loaninfoYN
//             }
//             res.send(data)
//         })
//         .catch(error => {
//             console.error(error)
//         })
// });
// app.get('/b', function(req, res) {
//     const { isbn13, libCode } = req.query
//     const isbn = `isbn13=${isbn13}`
//     const lib = `libCode=${libCode}`
//     const url1 = `${host}/srchDtlList?${authKey}&${isbn}&&${foramt}`
//     const url2 = `${host}/bookExist?${authKey}&${isbn}&${lib}&${foramt}`
//     const requestOne = axios.get(url1)
//     const requestTwo = axios.get(url2)
//     axios.all([requestOne, requestTwo]).then(axios.spread((...responses) => {
//         const responseOne = responses[0].data.response.detail[0].book
//         const responseTwo = responses[1].data.response
//         const { libCode } = responseTwo.request
//         res.send({...responseOne, libCode, ...responseTwo.result})
//     })).catch(error => {
//     })
// });
