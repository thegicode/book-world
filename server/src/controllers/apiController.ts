import { Request, Response } from "express";

import {
    fetchBooksFromNaver,
    fetchKyoboBookInfo,
    fetchBookAvailability,
    fetchMonthlyKeywords,
    fetchLibrariesByCriteria,
    fetchPopularBooksByCriteria,
    fetchLibrariesByBookISBN,
    fetchBookUsageAnalysis,
    saveRegistrationKey,
} from "../apis";

export const searchNaverBook = (req: Request, res: Response) => {
    fetchBooksFromNaver(req, res);
};

export const searchLibraries = (req: Request, res: Response) => {
    fetchLibrariesByCriteria(req, res);
};

export const checkBookExistence = (req: Request, res: Response) => {
    fetchBookAvailability(req, res);
};

export const getUsageAnalysis = (req: Request, res: Response) => {
    fetchBookUsageAnalysis(req, res);
};

export const searchLibrariesByBook = (req: Request, res: Response) => {
    fetchLibrariesByBookISBN(req, res);
};

export const getPopularBooks = (req: Request, res: Response) => {
    fetchPopularBooksByCriteria(req, res);
};

export const getMonthlyKeywords = (req: Request, res: Response) => {
    fetchMonthlyKeywords(req, res);
};

export const getKyoboBookInfo = (req: Request, res: Response) => {
    fetchKyoboBookInfo(req, res);
};

export const registerKey = (req: Request, res: Response) => {
    saveRegistrationKey(req, res);
};
