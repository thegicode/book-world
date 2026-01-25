import { AppError } from "../utils/AppError";

async function fetchNaver(url: string) {
    const headers = {
        "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID as string,
        "X-Naver-Client-Secret": process.env.NAVER_SECRET_KEY as string,
    };

    const response = await fetch(url, { headers });
    if (!response.ok) {
        // Create a more specific error
        throw new AppError(
            `Naver API request failed: ${response.statusText}`,
            response.status
        );
    }

    return response.json();
}

interface NaverBookSearchParams {
    keyword: string;
    display: string;
    start: string;
    sort: string;
}

// 키워드 검색
export async function searchNaverBooks(params: NaverBookSearchParams) {
    const queryParams = new URLSearchParams({
        query: params.keyword,
        display: params.display,
        start: params.start,
        sort: params.sort,
    });

    const data = await fetchNaver(
        `https://openapi.naver.com/v1/search/book.json?${queryParams}`
    );

    // Return only the necessary fields
    const { total, start, display, items } = data;
    return { total, start, display, items };
}
