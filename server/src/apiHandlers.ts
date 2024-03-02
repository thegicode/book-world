/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { searchBook } from "./naverApi";
import { searchBookByWeb } from "./kyoboApi";
import {
    getExistBookInfo,
    getKeysords,
    getPopularBooks,
    searchLibraryOfBook,
    searchOpenLibrary,
    usageAnalysis,
} from "./libraryApi";

/* NAVER */
export const searchNaverBook = (req: Request, res: Response) =>
    searchBook(req, res);

/* 교보문고 : eBook, sam 검색 */
export const searchKyoboBook = (req: Request, res: Response) =>
    searchBookByWeb(req, res);

/** 도서관 정보나루 */

// 정보공개 도서관 조회
export const librarySearch = (req: Request, res: Response) =>
    searchOpenLibrary(req, res);

// 지정 도서관, 책 소장 & 대출 가능 여부
export const bookExist = (req: Request, res: Response) =>
    getExistBookInfo(req, res);

// 도서별 이용 분석
export const usageAnalysisList = (req: Request, res: Response) =>
    usageAnalysis(req, res);

// 도서 소장 도서관 조회
export const librarySearchByBook = (req: Request, res: Response) =>
    searchLibraryOfBook(req, res);

// 인기 대출 도서 조회
export const loanItemSrch = (req: Request, res: Response) =>
    getPopularBooks(req, res);

// 이달의 키워드
export const monthlyKeywords = (req: Request, res: Response) =>
    getKeysords(req, res);

/* Regis Key */
export const regisKey = (req: Request, res: Response) => {
    const ENV_PATH = path.resolve("./server/.env.key");

    try {
        const key = (req.query.key as string).replace(/aaaaa/g, "\n");
        fs.writeFileSync(ENV_PATH, key);

        res.send(true);
    } catch (error) {
        res.send(false);
        console.error(`Fail to read file, ${error}`);
    }
};
