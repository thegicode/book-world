import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import * as BookService from "../apis";

// Naver Book Search
export const searchNaverBook = asyncHandler(
    async (req: Request, res: Response) => {
        const { keyword, display, start, sort } = req.query;
        if (!keyword || !display || !start || !sort) {
            throw new AppError("Missing required query parameters for Naver search", 400);
        }
        const books = await BookService.searchNaverBooks({
            keyword: keyword as string,
            display: display as string,
            start: start as string,
            sort: sort as string,
        });
        res.status(200).json({ status: "success", data: books });
    }
);

// Kyobo Book Info
export const getKyoboBookInfo = asyncHandler(
    async (req: Request, res: Response) => {
        const { isbn } = req.query;
        if (!isbn) {
            throw new AppError("Missing required query parameter: isbn", 400);
        }
        const bookInfo = await BookService.getKyoboBookInfoByIsbn(isbn as string);
        res.status(200).json({ status: "success", data: bookInfo });
    }
);

// Search Libraries by Criteria
export const searchLibraries = asyncHandler(
    async (req: Request, res: Response) => {
        const { dtl_region, page, pageSize } = req.query;
        if (!dtl_region || !page || !pageSize) {
            throw new AppError("Missing required library search parameters", 400);
        }
        const libraries = await BookService.searchLibrariesByCriteria({
            dtl_region: dtl_region as string,
            page: page as string,
            pageSize: pageSize as string,
        });
        res.status(200).json({ status: "success", data: libraries });
    }
);

// Check Book Existence in a Library
export const checkBookExistence = asyncHandler(
    async (req: Request, res: Response) => {
        const { isbn13, libCode } = req.query;
        if (!isbn13 || !libCode) {
            throw new AppError("Missing required parameters for book existence check", 400);
        }
        const result = await BookService.checkBookAvailability({
            isbn13: isbn13 as string,
            libCode: libCode as string,
        });
        res.status(200).json({ status: "success", data: result });
    }
);

// Get Book Usage Analysis
export const getUsageAnalysis = asyncHandler(
    async (req: Request, res: Response) => {
        const { isbn13 } = req.query;
        if (!isbn13) {
            throw new AppError("Missing required parameter: isbn13", 400);
        }
        const analysis = await BookService.getBookUsageAnalysis({ isbn13: isbn13 as string });
        res.status(200).json({ status: "success", data: analysis });
    }
);

// Search Libraries by Book ISBN
export const searchLibrariesByBook = asyncHandler(
    async (req: Request, res: Response) => {
        const { isbn, region, dtl_region } = req.query;
        if (!isbn || !region || !dtl_region) {
            throw new AppError("Missing required parameters for library by book search", 400);
        }
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
        const { startDt, endDt, pageNo, pageSize, ...optionalParams } = req.query;
        if (!startDt || !endDt || !pageNo || !pageSize) {
            throw new AppError("Missing required parameters for popular book search", 400);
        }
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
        const { month } = req.query;
        if (!month) {
            throw new AppError("Missing required parameter: month", 400);
        }
        const keywords = await BookService.getMonthlyKeywords({ month: month as string });
        res.status(200).json({ status: "success", data: keywords });
    }
);

// Register API Key
export const registerKey = asyncHandler(
    async (req: Request, res: Response) => {
        const { key } = req.query;
        if (!key) {
            throw new AppError("Missing required query parameter: key", 400);
        }
        BookService.saveApiKey(key as string);
        res.status(200).json({ status: "success", message: "API key saved." });
    }
);
