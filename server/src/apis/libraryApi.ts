import { fetchData } from "./apiUtils";
import { LibraryApiError } from "../errors/apiErrors";

const LIBRARY_API_BASE_URL = "http://data4library.kr/api";
const AUTH_KEY = process.env.LIBRARY_KEY as string;
const API_FORMAT = "json";

// Define interfaces for API response items to avoid 'any'
interface LibItem {
    lib: unknown;
}
interface LoanItem {
    loan: unknown;
}
interface LoanGrpItem {
    loanGrp: unknown;
}
interface KeywordItem {
    keyword: unknown;
}
interface BookItem {
    book: unknown;
}
interface DocItem {
    doc: unknown;
}

interface BookDoc {
    isbn13: string;
    [key: string]: unknown;
}

interface BookWithAvailability extends BookDoc {
    hasBook?: string;
    loanAvailable?: string;
}

const parseURL = (apiPath: string, params: Record<string, string>) => {
    const queryParams = new URLSearchParams({
        ...params,
        authKey: AUTH_KEY,
        format: API_FORMAT,
    });
    return `${LIBRARY_API_BASE_URL}/${apiPath}?${queryParams}`;
};

// Information disclosure library search
export async function searchLibrariesByCriteria(params: {
    dtl_region: string;
    page: string;
    pageSize: string;
}) {
    const url = parseURL("libSrch", params);
    const data = await fetchData(url);
    if (!data.response)
        throw new LibraryApiError(
            502,
            "Invalid API response from library server",
        );
    const { pageNo, pageSize, numFound, resultNum, libs } = data.response;
    return {
        pageNo,
        pageSize,
        numFound,
        resultNum,
        libraries: libs.map((item: LibItem) => item.lib),
    };
}

// Get library detail by libCode
export async function getLibraryDetail(params: { libCode: string }) {
    const url = parseURL("libSrch", params);
    const data = await fetchData(url);
    if (!data.response || !data.response.libs || data.response.libs.length === 0)
        throw new LibraryApiError(
            404,
            "Library not found",
        );
    
    return data.response.libs[0].lib;
}

// Check book availability
export async function checkBookAvailability(params: {
    isbn13: string;
    libCode: string;
}) {
    const url = parseURL("bookExist", params);
    const data = await fetchData(url);
    if (!data.response)
        throw new LibraryApiError(
            502,
            "Invalid API response from library server",
        );
    return data.response.result;
}

// Usage analysis per book
export async function getBookUsageAnalysis(params: { isbn13: string }) {
    const url = parseURL("usageAnalysisList", { ...params, loaninfoYN: "Y" });
    const data = await fetchData(url);
    if (!data.response)
        throw new LibraryApiError(
            502,
            "Invalid API response from library server",
        );

    const {
        book,
        loanHistory,
        loanGrps,
        keywords,
        coLoanBooks,
        maniaRecBooks,
        readerRecBooks,
    } = data.response;

    return {
        book,
        loanHistory: loanHistory?.map((item: LoanItem) => item.loan) || [],
        loanGrps:
            loanGrps?.slice(0, 5).map((item: LoanGrpItem) => item.loanGrp) ||
            [],
        keywords: keywords?.map((item: KeywordItem) => item.keyword) || [],
        coLoanBooks:
            coLoanBooks?.slice(0, 5).map((item: BookItem) => item.book) || [],
        maniaRecBooks:
            maniaRecBooks?.slice(0, 5).map((item: BookItem) => item.book) || [],
        readerRecBooks:
            readerRecBooks?.slice(0, 5).map((item: BookItem) => item.book) ||
            [],
    };
}

// Search libraries by book ISBN
export async function searchLibrariesByBook(params: {
    isbn: string;
    region: string;
    dtl_region: string;
}) {
    const url = parseURL("libSrchByBook", params);
    const data = await fetchData(url, { method: "GET" });
    if (!data.response)
        throw new LibraryApiError(
            502,
            "Invalid API response from library server",
        );

    const { pageNo, pageSize, numFound, resultNum, libs } = data.response;
    return {
        pageNo,
        pageSize,
        numFound,
        resultNum,
        libraries: libs.map((item: LibItem) => item.lib),
    };
}

// Search popular books
export async function searchPopularBooks(params: {
    startDt: string;
    endDt: string;
    gender: string;
    age: string;
    region: string;
    addCode: string;
    kdc: string;
    pageNo: string;
    pageSize: string;
}) {
    const url = parseURL("loanItemSrch", params);
    const data = await fetchData(url, { method: "GET" });
    if (!data.response)
        throw new LibraryApiError(
            502,
            "Invalid API response from library server",
        );

    const { resultNum, docs } = data.response;
    const docs2 = docs.map((item: DocItem) => item.doc);
    return { resultNum, data: docs2 };
}

// Monthly keywords
export async function getMonthlyKeywords(params: { month: string }) {
    const url = parseURL("monthlyKeywords", params);
    const data = await fetchData(url);
    if (!data.response)
        throw new LibraryApiError(
            502,
            "Invalid API response from library server",
        );

    const { keywords, request, resultNum } = data.response;
    return {
        keywords: keywords.map((keyword: KeywordItem) => keyword.keyword),
        request,
        resultNum,
    };
}

// Search books within a library
export async function srchBooksInLibrary(params: {
    libCode: string;
    keyword: string;
    pageNo: string;
    pageSize: string;
}) {
    // Remove spaces from keyword and use it as 'title' parameter
    const title = params.keyword.replace(/\s+/g, "");
    const searchParams = {
        libCode: params.libCode,
        pageNo: params.pageNo,
        pageSize: params.pageSize,
        title,
    };

    const url = parseURL("srchBooks", searchParams);
    const data = await fetchData(url, { method: "GET" });
    if (!data.response)
        throw new LibraryApiError(
            502,
            "Invalid API response from library server",
        );

    const { pageNo, pageSize, numFound, docs } = data.response;
    const docs2 = docs.map((item: DocItem) => item.doc as BookDoc);

    // Filter books by ownership
    const availabilityPromises = docs2.map(async (book: BookDoc) => {
        try {
            const availability = await checkBookAvailability({
                isbn13: book.isbn13,
                libCode: params.libCode,
            });
            return { ...book, ...availability } as BookWithAvailability;
        } catch (error) {
            console.error(`Failed to check availability for book ${book.isbn13}`, error);
            return null; // Treat error as not owned or skip
        }
    });

    const booksWithAvailability = await Promise.all(availabilityPromises);
    
    // Filter out books that are not owned (hasBook !== 'Y') or failed to check
    const ownedBooks = booksWithAvailability.filter((book: BookWithAvailability | null): book is BookWithAvailability => 
        book !== null && book.hasBook === 'Y'
    );

    return { pageNo, pageSize, numFound, resultNum: ownedBooks.length, data: ownedBooks };
}
