import CustomFetch from "./CustomFetch";

export class LibraryApiService {
    /**
     * 키워드로 도서관을 검색합니다.
     */
    static async searchLibrariesByKeyword(
        keyword: string,
        page = 1,
        pageSize = 20,
        signal?: AbortSignal
    ): Promise<IApiResponse<ILibrarySearchByBookResult>> {
        const url = `/api/library-search-by-keyword?keyword=${encodeURIComponent(
            keyword
        )}&page=${page}&pageSize=${pageSize}`;

        return CustomFetch.fetch<IApiResponse<ILibrarySearchByBookResult>>(url, {
            signal,
        });
    }
}
