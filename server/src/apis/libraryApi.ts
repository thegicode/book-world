import { Request, Response } from "express";
import { fetchData } from "./apiUtils";

const LIBRARY_API_BASE_URL = "http://data4library.kr/api";
const AUTH_KEY = process.env.LIBRARY_KEY as string;

const API_FORMAT = "json";

const parseURL = (apiPath: string, params: Record<string, string>) => {
    const queryParams = new URLSearchParams({
        ...params,
        authKey: AUTH_KEY as string,
        format: API_FORMAT,
    });

    return `${LIBRARY_API_BASE_URL}/${apiPath}?${queryParams}`;
};

// 정보공개 도서관 조회
export async function fetchLibrariesByCriteria(req: Request, res: Response) {
    const url = parseURL("libSrch", {
        dtl_region: req.query.dtl_region as string,
        pageNo: req.query.page as string,
        pageSize: req.query.pageSize as string,
    });

    try {
        const data = await fetchData(url);
        const { pageNo, pageSize, numFound, resultNum, libs } = data.response;
        res.send({
            pageNo,
            pageSize,
            numFound,
            resultNum,
            libraries: libs.map((item: { lib: string }) => item.lib),
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to get library search data");
    }
}

// 책 소장 & 대출 가능 여부
export async function fetchBookAvailability(req: Request, res: Response) {
    const url = parseURL("bookExist", {
        isbn13: req.query.isbn13 as string,
        libCode: req.query.libCode as string,
    });

    try {
        const data = await fetchData(url);
        const result = data.response?.result;
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to check book exist data");
    }
}

// 도서별 이용 분석
export async function fetchBookUsageAnalysis(req: Request, res: Response) {
    const url = parseURL("usageAnalysisList", {
        isbn13: req.query.isbn13 as string,
        loaninfoYN: "Y" as string,
    });
    try {
        const data = await fetchData(url);

        if (!data || !data.response) return;

        const {
            book,
            loanHistory, // 대출 추이
            loanGrps, // 다대출 이용자 그룹
            keywords, // 주요 키워드
            coLoanBooks, // 함께 대출된 도서
            maniaRecBooks, // 마니아를 위한 추천도서
            readerRecBooks, // 다독자를 위한 추천도서
        } = data.response;

        res.send({
            book,
            loanHistory:
                loanHistory &&
                loanHistory.map((item: { loan: string }) => item.loan),
            loanGrps:
                loanGrps &&
                loanGrps
                    .slice(0, 5)
                    .map((item: { loanGrp: string }) => item.loanGrp),
            keywords:
                keywords &&
                keywords.map((item: { keyword: string }) => item.keyword),
            coLoanBooks:
                coLoanBooks &&
                coLoanBooks.slice(0, 5).map((item: any) => item.book),
            maniaRecBooks:
                maniaRecBooks &&
                maniaRecBooks.slice(0, 5).map((item: any) => item.book),
            readerRecBooks:
                readerRecBooks &&
                readerRecBooks.slice(0, 5).map((item: any) => item.book),
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to get usage analysis list data");
    }
}

// 도서 소장 도서관 조회
export async function fetchLibrariesByBookISBN(req: Request, res: Response) {
    const { isbn, region, dtl_region } = req.query;

    if (
        typeof isbn !== "string" ||
        typeof region !== "string" ||
        typeof dtl_region !== "string"
    ) {
        return res.status(400).send("Invalid or missing query parameters.");
    }

    const url = parseURL("libSrchByBook", {
        isbn,
        region,
        dtl_region,
    });

    try {
        const data = await fetchData(url, { method: "GET" });
        const { pageNo, pageSize, numFound, resultNum, libs } = data.response;

        res.send({
            pageNo,
            pageSize,
            numFound,
            resultNum,
            libraries: libs.map((item: { lib: string }) => item.lib),
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to get library data");
    }
}

// 인기 대출 도서 조회
export async function fetchPopularBooksByCriteria(req: Request, res: Response) {
    const {
        startDt,
        endDt,
        gender,
        age,
        region,
        addCode,
        kdc,
        pageNo,
        pageSize,
    } = req.query;

    if (
        typeof startDt !== "string" ||
        typeof endDt !== "string" ||
        typeof gender !== "string" ||
        typeof age !== "string" ||
        typeof region !== "string" ||
        typeof addCode !== "string" ||
        typeof kdc !== "string" ||
        typeof pageNo !== "string" ||
        typeof pageSize !== "string"
    ) {
        return res.status(400).send("Invalid or missing query parameters.");
    }

    const url = parseURL("loanItemSrch", {
        startDt,
        endDt,
        gender,
        age,
        region,
        addCode,
        kdc,
        pageNo,
        pageSize,
    });

    try {
        const data = await fetchData(url, { method: "GET" });
        const { resultNum, docs } = data.response;
        const docs2 = docs.map((item: any) => item.doc);
        res.send({ resultNum, data: docs2 });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to get library data");
    }
}

// 이달의 키워드
export async function fetchMonthlyKeywords(req: Request, res: Response) {
    const url = parseURL("monthlyKeywords", {
        month: req.query.month as string,
    });
    try {
        const data = await fetchData(url);
        const { keywords, request, resultNum } = data.response;
        res.send({
            keywords: keywords.map((keyword: any) => keyword.keyword),
            request,
            resultNum,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to get library search data");
    }
}

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
