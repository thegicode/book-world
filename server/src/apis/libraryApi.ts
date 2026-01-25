import { fetchData } from "./apiUtils";
import { AppError } from "../utils/AppError";

const LIBRARY_API_BASE_URL = "http://data4library.kr/api";
const AUTH_KEY = process.env.LIBRARY_KEY as string;
const API_FORMAT = "json";

const parseURL = (apiPath: string, params: Record<string, string>) => {
    const queryParams = new URLSearchParams({
        ...params,
        authKey: AUTH_KEY,
        format: API_FORMAT,
    });
    return `${LIBRARY_API_BASE_URL}/${apiPath}?${queryParams}`;
};

// Information disclosure library search
export async function searchLibrariesByCriteria(params: { dtl_region: string; page: string; pageSize: string; }) {
    const url = parseURL("libSrch", params);
    const data = await fetchData(url);
    if (!data.response) throw new AppError("Invalid API response from library server", 502);
    const { pageNo, pageSize, numFound, resultNum, libs } = data.response;
    return {
        pageNo,
        pageSize,
        numFound,
        resultNum,
        libraries: libs.map((item: { lib: any }) => item.lib),
    };
}

// Check book availability
export async function checkBookAvailability(params: { isbn13: string; libCode: string; }) {
    const url = parseURL("bookExist", params);
    const data = await fetchData(url);
    if (!data.response) throw new AppError("Invalid API response from library server", 502);
    return data.response.result;
}

// Usage analysis per book
export async function getBookUsageAnalysis(params: { isbn13: string }) {
    const url = parseURL("usageAnalysisList", { ...params, loaninfoYN: "Y" });
    const data = await fetchData(url);
    if (!data.response) throw new AppError("Invalid API response from library server", 502);
    
    const { book, loanHistory, loanGrps, keywords, coLoanBooks, maniaRecBooks, readerRecBooks } = data.response;
    
    return {
        book,
        loanHistory: loanHistory?.map((item: { loan: any }) => item.loan) || [],
        loanGrps: loanGrps?.slice(0, 5).map((item: { loanGrp: any }) => item.loanGrp) || [],
        keywords: keywords?.map((item: { keyword: any }) => item.keyword) || [],
        coLoanBooks: coLoanBooks?.slice(0, 5).map((item: { book: any }) => item.book) || [],
        maniaRecBooks: maniaRecBooks?.slice(0, 5).map((item: { book: any }) => item.book) || [],
        readerRecBooks: readerRecBooks?.slice(0, 5).map((item: { book: any }) => item.book) || [],
    };
}

// Search libraries by book ISBN
export async function searchLibrariesByBook(params: { isbn: string; region: string; dtl_region: string; }) {
    const url = parseURL("libSrchByBook", params);
    const data = await fetchData(url, { method: "GET" });
    if (!data.response) throw new AppError("Invalid API response from library server", 502);

    const { pageNo, pageSize, numFound, resultNum, libs } = data.response;
    return {
        pageNo,
        pageSize,
        numFound,
        resultNum,
        libraries: libs.map((item: { lib: any }) => item.lib),
    };
}

// Search popular books
export async function searchPopularBooks(params: { startDt: string; endDt: string; gender: string; age: string; region: string; addCode: string; kdc: string; pageNo: string; pageSize: string; }) {
    const url = parseURL("loanItemSrch", params);
    const data = await fetchData(url, { method: "GET" });
    if (!data.response) throw new AppError("Invalid API response from library server", 502);

    const { resultNum, docs } = data.response;
    const docs2 = docs.map((item: any) => item.doc);
    return { resultNum, data: docs2 };
}

// Monthly keywords
export async function getMonthlyKeywords(params: { month: string }) {
    const url = parseURL("monthlyKeywords", params);
    const data = await fetchData(url);
    if (!data.response) throw new AppError("Invalid API response from library server", 502);

    const { keywords, request, resultNum } = data.response;
    return {
        keywords: keywords.map((keyword: any) => keyword.keyword),
        request,
        resultNum,
    };
}
