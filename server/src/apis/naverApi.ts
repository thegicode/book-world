import { Request, Response } from "express";

async function fetchNaver(url: string) {
    const headers = {
        "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID as string,
        "X-Naver-Client-Secret": process.env.NAVER_SECRET_KEY as string,
    };

    const response = await fetch(url, { headers });
    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    return await response.json();
}

// 키워드 검색
export async function fetchBooksFromNaver(req: Request, res: Response) {
    const queryParams = new URLSearchParams({
        query: req.query.keyword as string,
        display: req.query.display as string,
        start: req.query.start as string,
        sort: req.query.sort as string,
    });

    const data = await fetchNaver(
        `https://openapi.naver.com/v1/search/book.json?${queryParams}`
    );
    const { total, start, display, items } = data;
    res.send({ total, start, display, items });
}
