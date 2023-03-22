/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 7777;

app.use(express.static(`${__dirname}/src/`));

const { libKey, naverKey } = require("./user.js");

/** NAVER */

// 키워드 검색
app.get("/search-naver-book", async (req, res) => {
    const { keyword, display, start } = req.query;
    const queryParams = new URLSearchParams({
        query: keyword,
        display,
        start,
    });
    const headers = {
        "X-Naver-Client-Id": naverKey.clientID,
        "X-Naver-Client-Secret": naverKey.clientSecret,
    };
    const url = `https://openapi.naver.com/v1/search/book.json?${queryParams}`;
    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(
                `Failed to get books from Naver: ${response.statusText}`
            );
        }
        const data = await response.json();
        const { total, start, display, items } = data;
        res.send({ total, start, display, items });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to get books from Naver");
    }
});

/** 도서관 정보나루 */
const host = "http://data4library.kr/api";
const authKey = `authKey=${libKey}`;
// const authToken = `Bearer ${libKey}`
const formatType = "json";

// 정보공개 도서관 조회
app.get("/library-search", async (req, res) => {
    const { dtl_region, page, pageSize } = req.query;
    const queryParams = new URLSearchParams({
        dtl_region,
        pageNo: page,
        pageSize,
        format: formatType,
    });
    const url = `${host}/libSrch?${authKey}&${queryParams}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(
                `Failed to get library search data: ${response.statusText}`
            );
        }
        const data = await response.json();
        const { pageNo, pageSize, numFound, resultNum, libs } = data.response;
        const formattedData = {
            pageNo,
            pageSize,
            numFound,
            resultNum,
            libraries: libs.map((item) => item.lib),
        };
        res.send(formattedData);
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to get library search data");
    }
});

// 지정 도서관, 책 소장 & 대출 가능 여부
app.get("/book-exist", async (req, res) => {
    const { isbn13, libCode } = req.query;
    const queryParams = new URLSearchParams({
        isbn13,
        libCode,
        format: formatType,
    });
    const url = `${host}/bookExist?${authKey}&${queryParams}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(
                `Failed to check book exist data: ${response.statusText}`
            );
        }
        const data = await response.json();
        const result = data.response?.result;
        // console.log(result)

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to check book exist data");
    }
});

// 도서별 이용 분석
app.get("/usage-analysis-list", async (req, res) => {
    const { isbn13 } = req.query;
    const params = new URLSearchParams({
        isbn13,
        loaninfoYN: "Y",
        format: formatType,
    });
    const url = `${host}/usageAnalysisList?${authKey}&${params}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(
                `Failed to get usage analysis list data: ${response.statusText} `
            );
        }
        const data = await response.json();
        const { book, loanHistory, loanGrps, keywords, recBooks, coLoanBooks } =
            data.response;

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
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to get usage analysis list data");
    }
});

// 도서 소장 도서관 조회
app.get("/library-search-by-book", async (req, res) => {
    const { isbn, region, dtl_region } = req.query;
    const params = new URLSearchParams({
        isbn,
        region,
        dtl_region,
        format: formatType,
    });
    const url = `${host}/libSrchByBook?${authKey}&${params}`;
    try {
        const response = await fetch(url, { method: "GET" });
        if (!response.ok) {
            throw new Error(
                `Failed to get library data: ${response.statusText}`
            );
        }
        const data = await response.json();
        const { pageNo, pageSize, numFound, resultNum, libs } = data.response;
        res.send({
            pageNo,
            pageSize,
            numFound,
            resultNum,
            libraries: libs.map((item) => item.lib),
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to get library data");
    }
});

// Router
const routes = ["favorite", "library", "search", "book", "setting"];
routes.forEach((route) => {
    app.get(`/${route}`, (req, res) => {
        console.log("route:", `/${route}`);

        const htmlPath = path.resolve(__dirname, `src/html/${route}.html`);
        fs.readFile(htmlPath, "utf8", (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Failed to load HTML file");
            }
            res.send(data);
        });
    });
});

app.listen(port, () => {
    console.log(`Start : http://localhost:${port}`);
});

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
