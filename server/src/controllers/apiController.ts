import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as BookService from "../apis";

// Naver Book Search

export const searchNaverBook = asyncHandler(
    async (req: Request, res: Response) => {
        const { keyword, display, start, sort } = req.query as { keyword: string, display: string, start: string, sort: string };

        const books = await BookService.searchNaverBooks({
            keyword: keyword as string,
            display: display as string,
            start: start as string,
            sort: sort as string,
        });
        res.status(200).json({ status: "success", data: books });
    }
);

export const searchBookSideBooks = asyncHandler(
    async (req: Request, res: Response) => {
        const { keyword, display, start, sort } = req.query as {
            keyword: string;
            display: string;
            start: string;
            sort: string;
        };

        const books = await BookService.searchBookSideBooks({
            keyword,
            display,
            start,
            sort,
        });
        res.status(200).json({ status: "success", data: books });
    },
);

// Kyobo Book Info
export const getKyoboBookInfo = asyncHandler(
    async (req: Request, res: Response) => {
        const { isbn } = req.query as { isbn: string };
        const bookInfo = await BookService.getKyoboBookInfoByIsbn(isbn as string);
        res.status(200).json({ status: "success", data: bookInfo });
    }
);

// Search Libraries by Keyword
export const searchLibrariesByKeyword = asyncHandler(
    async (req: Request, res: Response) => {
        const { keyword, page, pageSize } = req.query as { keyword: string, page: string, pageSize: string };

        const libraries = await BookService.searchLibrariesByKeyword({
            keyword: keyword as string,
            page: page as string,
            pageSize: pageSize as string,
        });
        res.status(200).json({ status: "success", data: libraries });
    }
);

export const searchBookSideLibraries = asyncHandler(
    async (req: Request, res: Response) => {
        const { keyword, page, pageSize } = req.query as {
            keyword: string;
            page: string;
            pageSize: string;
        };

        const libraries = await BookService.searchBookSideLibrariesByKeyword({
            keyword,
            page,
            pageSize,
        });
        res.status(200).json({ status: "success", data: libraries });
    },
);

// Get Library Detail by libCode
export const getLibraryDetail = asyncHandler(
    async (req: Request, res: Response) => {
        const { libCode } = req.query as { libCode: string };
        const library = await BookService.getLibraryDetail({ libCode: libCode as string });
        res.status(200).json({ status: "success", data: library });
    }
);

// Check Book Existence in a Library
export const checkBookExistence = asyncHandler(
    async (req: Request, res: Response) => {
        const { isbn13, libCode } = req.query as { isbn13: string, libCode: string };

        const result = await BookService.checkBookAvailability({
            isbn13: isbn13 as string,
            libCode: libCode as string,
        });
        res.status(200).json({ status: "success", data: result });
    }
);

export const checkBookSideAvailabilityBatch = asyncHandler(
    async (req: Request, res: Response) => {
        const { isbn13, libCodes } = req.query as {
            isbn13: string;
            libCodes: string;
        };

        const libraries = await BookService.checkBookAvailabilityBatch({
            isbn13,
            libCodes: libCodes.split(",").filter(Boolean),
        });
        res.status(200).json({ status: "success", data: libraries });
    },
);

// Get Book Usage Analysis
export const getUsageAnalysis = asyncHandler(
    async (req: Request, res: Response) => {
        const { isbn13 } = req.query as { isbn13: string };
        const analysis = await BookService.getBookUsageAnalysis({ isbn13: isbn13 as string });
        res.status(200).json({ status: "success", data: analysis });
    }
);

// Search Libraries by Book ISBN
export const searchLibrariesByBook = asyncHandler(
    async (req: Request, res: Response) => {
        const { isbn, region, dtl_region } = req.query as { isbn: string, region: string, dtl_region: string };

        const libraries = await BookService.searchLibrariesByBook({
            isbn: isbn as string,
            region: region as string,
            dtl_region: dtl_region as string,
        });
        res.status(200).json({ status: "success", data: libraries });
    }
);

// Search Popular Books
export const getPopularBooks = asyncHandler(
    async (req: Request, res: Response) => {
        const { startDt, endDt, pageNo, pageSize, ...optionalParams } = req.query as { startDt: string, endDt: string, pageNo: string, pageSize: string, gender?: string, age?: string, region?: string, addCode?: string, kdc?: string };

        const books = await BookService.searchPopularBooks({
            startDt: startDt as string,
            endDt: endDt as string,
            pageNo: pageNo as string,
            pageSize: pageSize as string,
            gender: optionalParams.gender as string || '',
            age: optionalParams.age as string || '',
            region: optionalParams.region as string || '',
            addCode: optionalParams.addCode as string || '',
            kdc: optionalParams.kdc as string || '',
        });
        res.status(200).json({ status: "success", data: books });
    }
);

// Get Monthly Keywords
export const getMonthlyKeywords = asyncHandler(
    async (req: Request, res: Response) => {
        const { month } = req.query as { month: string };
        const keywords = await BookService.getMonthlyKeywords({ month: month as string });
        res.status(200).json({ status: "success", data: keywords });
    }
);

// Search Books in a Library
export const srchBooksInLibrary = asyncHandler(
    async (req: Request, res: Response) => {
        const { libCode, keyword, pageNo, pageSize } = req.query as { libCode: string, keyword: string, pageNo: string, pageSize: string };
        const books = await BookService.srchBooksInLibrary({
            libCode,
            keyword,
            pageNo,
            pageSize,
        });
        res.status(200).json({ status: "success", data: books });
    }
);
