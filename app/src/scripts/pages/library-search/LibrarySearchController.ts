import { ReactiveController, ReactiveControllerHost } from "lit";
import { LibraryApiService } from "@/services";

export class LibrarySearchController implements ReactiveController {
    private host: ReactiveControllerHost;

    // 검색 상태
    keyword = "";
    page = 1;
    pageSize = 20;
    total = 0;
    items: ILibraryData[] = [];
    loading = false;
    error: string | null = null;
    hasSearched = false;

    private abortController: AbortController | null = null;

    constructor(host: ReactiveControllerHost) {
        (this.host = host).addController(this);
    }

    hostDisconnected() {
        // 컴포넌트 해제 시 진행 중인 요청 취소
        this.abortController?.abort();
    }

    async search(keyword: string) {
        const trimmedKeyword = keyword.trim();
        if (!trimmedKeyword) return;

        // 이전 요청 취소
        this.abortController?.abort();
        this.abortController = new AbortController();

        // 초기 상태 설정
        this.keyword = trimmedKeyword;
        this.page = 1;
        this.items = [];
        this.total = 0;
        this.error = null;
        this.hasSearched = true;
        this.loading = true;
        this.host.requestUpdate();

        await this.fetchData();
    }

    async loadMore() {
        if (this.loading || !this.hasMoreData()) return;

        this.page += 1;
        this.loading = true;
        this.host.requestUpdate();

        await this.fetchData();
    }

    retry() {
        if (this.loading) return;
        this.loading = true;
        this.error = null;
        this.host.requestUpdate();

        this.fetchData();
    }

    hasMoreData() {
        return this.items.length < this.total;
    }

    private async fetchData() {
        try {
            const response = await LibraryApiService.searchLibrariesByKeyword(
                this.keyword,
                this.page,
                this.pageSize,
                this.abortController?.signal
            );

            if (response.status === "success") {
                const data = response.data;
                const newItems = data.libraries || [];

                this.items = this.page === 1 ? newItems : [...this.items, ...newItems];
                this.total = data.numFound || 0;
                this.error = null;
            } else {
                this.error = response.message || "API Error";
            }
        } catch (error: unknown) {
            if (error instanceof DOMException && error.name === "AbortError") {
                return; // 취소된 요청은 무시
            }
            console.error(error);
            this.error = "데이터를 불러오는 중 오류가 발생했습니다.";
        } finally {
            this.loading = false;
            this.host.requestUpdate();
        }
    }
}
