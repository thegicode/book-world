import { KakaoApiError } from "../errors/apiErrors";

async function fetchKakao(url: string) {
    const kakaoKey = process.env.KAKAO_REST_KEY || process.env.KAKAO_REST_API_KEY as string;
    const headers = {
        Authorization: `KakaoAK ${kakaoKey}`,
    };

    const response = await fetch(url, { headers });
    if (!response.ok) {
        throw new KakaoApiError(response.status, response.statusText);
    }

    return response.json();
}

export interface BookSearchParams {
    keyword: string;
    display: string;
    start: string;
    sort: string;
}

export interface BookItem {
    title: string;
    link: string;
    image: string;
    author: string;
    publisher: string;
    pubdate: string;
    isbn: string;
    description: string;
}

function extractIsbn13(isbn: string) {
    return isbn.split(/\s+/).find((value) => /^\d{13}$/.test(value)) || "";
}

export async function searchKakaoBooks(params: BookSearchParams) {
    const displayCount = Math.min(Math.max(parseInt(params.display || "10", 10), 1), 50);
    const startIndex = Math.max(parseInt(params.start || "1", 10), 1);
    const page = Math.floor((startIndex - 1) / displayCount) + 1;

    const queryParams = new URLSearchParams({
        query: params.keyword,
        page: String(page),
        size: String(displayCount),
        sort: params.sort === "date" ? "latest" : "accuracy",
    });

    const data = await fetchKakao(
        `https://dapi.kakao.com/v3/search/book?${queryParams}`
    );

    const total = data.meta?.total_count || 0;
    const items: BookItem[] = (data.documents || []).map((doc: Record<string, any>) => ({
        title: doc.title || "",
        link: doc.url || "",
        image: doc.thumbnail || "",
        author: Array.isArray(doc.authors) ? doc.authors.join(", ") : (doc.authors || ""),
        publisher: doc.publisher || "",
        pubdate: doc.datetime ? doc.datetime.substring(0, 10).replace(/-/g, "") : "",
        isbn: doc.isbn || "",
        description: doc.contents || "",
    }));

    return { total, start: startIndex, display: displayCount, items };
}

export async function searchBookSideBooks(params: BookSearchParams) {
    const data = await searchKakaoBooks(params);

    return {
        total: data.total,
        start: data.start,
        display: data.display,
        items: data.items.map((item: BookItem) => ({
            title: item.title,
            author: item.author,
            image: item.image,
            publisher: item.publisher,
            pubdate: item.pubdate,
            isbn: item.isbn,
            isbn13: extractIsbn13(item.isbn),
            link: item.link,
        })),
    };
}
