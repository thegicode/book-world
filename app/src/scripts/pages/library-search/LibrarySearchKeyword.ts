import { CustomFetch } from "@/services";
import { manageFocus } from "@/utils/helpers";
import LibraryList from "./LibraryList";
import { LoadingComponent } from "@/components"; // Assuming LoadingComponent is exported from components/index or similar

export default class LibrarySearchKeyword extends HTMLElement {
    private searchForm: HTMLFormElement | null;
    private keywordInput: HTMLInputElement | null;
    private libraryList: LibraryList | null;
    private loadingComponent: LoadingComponent | null;
    
    // Pagination & State
    private readonly PAGE_SIZE = 20;
    private currentPage = 1;
    private currentKeyword = "";
    private total = 0;
    private currentItemCount = 0;
    private isFetching = false;
    private abortController: AbortController | null = null;

    // Infinite Scroll
    private observer: IntersectionObserver | null = null;
    private sentinel: HTMLElement | null = null;

    constructor() {
        super();
        this.searchForm = this.querySelector(".search-form");
        this.keywordInput = this.querySelector('input[name="keyword"]');
        this.libraryList = this.querySelector("library-list");
        this.loadingComponent = this.querySelector("loading-component");

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
        this.abortController?.abort();
    }

    private initIntersectionObserver() {
        this.observer = new IntersectionObserver(this.handleIntersect, {
            root: null,
            rootMargin: "300px 0px", // Pre-fetch before reaching bottom
            threshold: 0,
        });

        // Create a sentinel element for infinite scrolling
        this.sentinel = document.createElement("div");
        this.sentinel.className = "sentinel";
        this.sentinel.setAttribute("aria-hidden", "true");
        this.sentinel.style.height = "1px"; // Make sure it has dimensions
        
        // Append sentinel after the list
        // Note: Ideally, sentinel should be inside library-list or after it.
        // Since library-list is a custom element, we can append sentinel as a sibling or ask library-list to handle it.
        // For simplicity, let's append it to the .library-body which contains library-list
        const body = this.querySelector(".library-body");
        if (body) {
            body.appendChild(this.sentinel);
            this.observer.observe(this.sentinel);
        }
    }

    private handleIntersect(entries: IntersectionObserverEntry[]) {
        const entry = entries[0];
        if (entry.isIntersecting && !this.isFetching && this.hasMoreData()) {
            this.loadMore();
        }
    }

    private hasMoreData(): boolean {
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
        this.currentItemCount = 0;
        
        // Abort previous request
        if (this.abortController) {
            this.abortController.abort();
        }
        this.abortController = new AbortController();

        // Clear list
        this.libraryList?.clear();
        
        await this.fetchData(1, true);

        // Move focus for accessibility
        if (this.libraryList) {
            manageFocus(this.libraryList, ".library-list"); // Focusing the list container
        }
    }

    private async loadMore() {
        await this.fetchData(this.currentPage + 1, false);
    }

    private async fetchData(page: number, isNewSearch: boolean) {
        if (this.isFetching) return;
        this.isFetching = true;
        this.loadingComponent?.show();

        const url = `/api/library-search-by-keyword?keyword=${encodeURIComponent(this.currentKeyword)}&page=${page}&pageSize=${this.PAGE_SIZE}`;

        try {
            const response = await CustomFetch.fetch<IApiResponse<ILibrarySearchByBookResult>>(url, {
                signal: this.abortController?.signal
            });

            if (response.status === 'success') {
                const data = response.data;
                const items = data.libraries || [];
                this.total = data.numFound || 0;
                
                if (isNewSearch) {
                    this.libraryList?.setItems(items);
                    this.currentPage = 1;
                    this.currentItemCount = items.length;
                } else {
                    this.libraryList?.appendItems(items);
                    this.currentPage = page;
                    this.currentItemCount += items.length;
                }
                
                // Re-append sentinel to end of container if necessary
                // (Depends on DOM structure, but if sentinel is sibling to library-list, it stays at bottom)
            } else {
                this.libraryList?.renderError(response.message || 'API Error');
            }
        } catch (error: unknown) {
            if (error instanceof DOMException && error.name === "AbortError") {
                // Ignore abort errors
                return;
            }
            console.error(error);
            this.libraryList?.renderError("데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
            this.isFetching = false;
            this.loadingComponent?.hide();
        }
    }
}