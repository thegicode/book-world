import fs from "fs";
import path from "path";
import { fetchData } from "./apiUtils";
import { LibraryApiError } from "../errors/apiErrors";
import { rootDirectoryPath } from "../config";

const LIBRARY_API_BASE_URL = "http://data4library.kr/api";
const AUTH_KEY = process.env.LIBRARY_KEY as string;
const API_FORMAT = "json";
const CACHE_DIR = path.join(rootDirectoryPath, "server/data");
const CACHE_FILE = path.join(CACHE_DIR, "libraries.json");

interface ILibrary {
    libCode: string;
    libName: string;
    address: string;
    homepage: string;
    telephone: string;
    [key: string]: unknown;
}

// Define interfaces for API response items to avoid 'any'
interface LibItem {
    lib: ILibrary;
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

// Helper to ensure cache directory exists
const ensureCacheDir = () => {
    if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
};

// Helper to fetch all libraries and cache them
const fetchAndCacheLibraries = async (): Promise<ILibrary[]> => {
    // 1. Get total count
    const countUrl = parseURL("libSrch", { pageNo: "1", pageSize: "1" });
    const countData = await fetchData(countUrl);
    if (!countData.response) throw new Error("Invalid API response for count");
    
    const totalCount = countData.response.numFound;

    // 2. Fetch all
    const allUrl = parseURL("libSrch", { pageNo: "1", pageSize: String(totalCount) });
    const allData = await fetchData(allUrl);
    if (!allData.response || !allData.response.libs) throw new Error("Invalid API response for all libraries");

    const libraries = allData.response.libs.map((item: LibItem) => item.lib);

    // 3. Save to file
    ensureCacheDir();
    fs.writeFileSync(CACHE_FILE, JSON.stringify(libraries, null, 2));

    return libraries;
};

// Search libraries by keyword (libName) using Cache
export async function searchLibrariesByKeyword(params: {
    keyword: string;
    page: string;
    pageSize: string;
}) {
    let libraries: ILibrary[] = [];

    if (fs.existsSync(CACHE_FILE)) {
        const fileContent = fs.readFileSync(CACHE_FILE, "utf-8");
        libraries = JSON.parse(fileContent);
    } else {
        libraries = await fetchAndCacheLibraries();
    }

    // Filter by keyword
    const filtered = libraries.filter(lib => 
        lib.libName.includes(params.keyword)
    );

    // Pagination
    const page = parseInt(params.page, 10);
    const pageSize = parseInt(params.pageSize, 10);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginated = filtered.slice(start, end);

    return {
        pageNo: params.page,
        pageSize: params.pageSize,
        numFound: filtered.length,
        resultNum: paginated.length,
        libraries: paginated,
    };
}

// Get library detail by libCode
export async function getLibraryDetail(params: { libCode: string }) {
    let libraries: ILibrary[] = [];

    if (fs.existsSync(CACHE_FILE)) {
        const fileContent = fs.readFileSync(CACHE_FILE, "utf-8");
        libraries = JSON.parse(fileContent);
    } else {
        libraries = await fetchAndCacheLibraries();
    }

    const library = libraries.find(lib => lib.libCode === params.libCode);

    if (!library) {
        throw new LibraryApiError(404, "Library not found");
    }

    return library;
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
