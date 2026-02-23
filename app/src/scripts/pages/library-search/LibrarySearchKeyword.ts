import { FetchListComponent } from "@/components";
import { manageFocus } from "@/utils/helpers";
import LibrarySearchItem from "./LibrarySearchItem";

export default class LibrarySearchKeyword extends FetchListComponent<ILibrarySearchByBookResult, ILibraryData> {
    private searchForm: HTMLFormElement | null;
    private keywordInput: HTMLInputElement | null;
    private statusElement: HTMLElement | null;
    private readonly PAGE_SIZE = 20;
    private currentPage = 1;
    private currentKeyword = "";
    private isFetching = false;
    private requestSequence = 0;
    private readonly bodyElement: HTMLElement | null;
    private observer: IntersectionObserver | null = null;
    private sentinel: HTMLElement | null = null;
    private requestController: AbortController | null = null;

    constructor() {
        super();
        this.searchForm = this.querySelector(".search-form");
        this.keywordInput = this.querySelector('input[name="keyword"]');
        this.statusElement = this.querySelector("[data-result-status]");
        this.bodyElement = this.querySelector(".library-body");
        
        this.handleSearch = this.handleSearch.bind(this);
        this.handleIntersect = this.handleIntersect.bind(this);
    }

    connectedCallback() {
        this.searchForm?.addEventListener("submit", this.handleSearch);
        this.initIntersectionObserver();
    }

    disconnectedCallback() {
        this.searchForm?.removeEventListener("submit", this.handleSearch);
        this.observer?.disconnect();
        this.requestController?.abort();
    }

    private initIntersectionObserver() {
        this.observer = new IntersectionObserver(this.handleIntersect, {
            root: null,
            rootMargin: "300px 0px",
            threshold: 0,
        });

        // Create a sentinel element for infinite scrolling
        this.sentinel = document.createElement("div");
        this.sentinel.className = "sentinel";
        this.sentinel.setAttribute("aria-hidden", "true");
        this.bodyElement?.appendChild(this.sentinel);
        
        if (this.sentinel) {
            this.observer.observe(this.sentinel);
        }
    }

    private handleIntersect(entries: IntersectionObserverEntry[]) {
        if (entries[0].isIntersecting && !this.isFetching && this.hasMoreData()) {
            this.loadMore();
        }
    }

    private hasMoreData(): boolean {
        // currentItemCount is updated in FetchListComponent
        return this.currentItemCount < this.total;
    }

    private async handleSearch(event: Event) {
        event.preventDefault();
        const keyword = this.keywordInput?.value.trim();
        if (!keyword) {
            this.keywordInput?.reportValidity();
            return;
        }

        this.currentKeyword = keyword;
        this.currentPage = 1;
        this.total = 0;
        this.currentItemCount = 0; // Reset count
        this.listContainer.innerHTML = "";
        this.updateStatus(`"${keyword}" 검색 중`);
        this.requestSequence += 1;
        this.requestController?.abort();
        this.requestController = new AbortController();
        
        await this.loadData(1, this.requestSequence);
        
        // Move focus to the results list for accessibility
        manageFocus(this, ".library-list");
    }

    private async loadMore() {
        const nextPage = this.currentPage + 1;
        const didLoad = await this.loadData(nextPage, this.requestSequence);
        if (didLoad) {
            this.currentPage = nextPage;
        }
    }

    private async loadData(page: number, sequence: number) {
        if (!this.currentKeyword || this.isFetching) return;
        this.isFetching = true;
        const url = `/api/library-search-by-keyword?keyword=${encodeURIComponent(this.currentKeyword)}&page=${page}&pageSize=${this.PAGE_SIZE}`;
        try {
            const didLoad = await this.fetchData(url, { signal: this.requestController?.signal });
            return didLoad && sequence === this.requestSequence;
        } finally {
            this.isFetching = false;
        }
    }

    // --- Implementation of abstract/overridden methods ---

    protected getItems(data: ILibrarySearchByBookResult): ILibraryData[] {
        return data.libraries || [];
    }

    protected getTotal(data: ILibrarySearchByBookResult): number {
        // server returns numFound as total count
        return data.numFound || 0;
    }

    protected createItem(lib: ILibraryData): HTMLElement {
        return new LibrarySearchItem(lib);
    }

    protected onRenderComplete(): void {
        this.updateStatus(`"${this.currentKeyword}" 검색 결과 ${this.currentItemCount}건 표시 중 (총 ${this.total}건)`);
        // Move sentinel to the end
        if (this.sentinel && this.bodyElement) {
             this.bodyElement.appendChild(this.sentinel);
        }
    }

    protected handleFetchSuccess(data: ILibrarySearchByBookResult) {
        super.handleFetchSuccess(data);
        if (this.total === 0) {
            this.updateStatus(`"${this.currentKeyword}" 검색 결과가 없습니다.`);
        }
    }

    protected handleFetchError(error: unknown) {
        super.handleFetchError(error);
        this.updateStatus("검색 중 오류가 발생했습니다.");
    }

    private updateStatus(message: string) {
        if (this.statusElement) {
            this.statusElement.textContent = message;
        }
    }
}
