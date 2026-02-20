import { FetchListComponent } from "../../components";
import LibrarySearchItem from "./LibrarySearchItem";

export default class LibrarySearchKeyword extends FetchListComponent<ILibrarySearchByBookResult, ILibraryData> {
    private searchForm: HTMLFormElement | null;
    private keywordInput: HTMLInputElement | null;
    private readonly PAGE_SIZE = 20;
    private currentPage = 1;
    private currentKeyword = "";
    private observer: IntersectionObserver | null = null;
    private sentinel: HTMLElement | null = null;

    constructor() {
        super();
        this.searchForm = this.querySelector(".search-form");
        this.keywordInput = this.querySelector('input[name="keyword"]');
        
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
    }

    private initIntersectionObserver() {
        this.observer = new IntersectionObserver(this.handleIntersect, {
            root: null,
            rootMargin: "0px",
            threshold: 1.0,
        });

        // Create a sentinel element for infinite scrolling
        this.sentinel = document.createElement("div");
        this.sentinel.className = "sentinel";
        this.querySelector(".library-body")?.appendChild(this.sentinel);
        
        if (this.sentinel) {
            this.observer.observe(this.sentinel);
        }
    }

    private handleIntersect(entries: IntersectionObserverEntry[]) {
        if (entries[0].isIntersecting && this.hasMoreData()) {
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
        if (!keyword) return;

        this.currentKeyword = keyword;
        this.currentPage = 1;
        this.currentItemCount = 0; // Reset count
        this.listContainer.innerHTML = "";
        
        await this.loadData();
    }

    private async loadMore() {
        this.currentPage++;
        await this.loadData();
    }

    private async loadData() {
        const url = `/api/library-search-by-keyword?keyword=${encodeURIComponent(this.currentKeyword)}&page=${this.currentPage}&pageSize=${this.PAGE_SIZE}`;
        await this.fetchData(url);
    }

    // --- Implementation of abstract/overridden methods ---

    protected getItems(data: ILibrarySearchByBookResult): ILibraryData[] {
        return data.libraries || [];
    }

    protected getTotal(data: ILibrarySearchByBookResult): number {
        // server returns numFound as total count
        return (data as any).numFound || 0;
    }

    protected createItem(lib: ILibraryData): HTMLElement {
        return new LibrarySearchItem(lib);
    }

    protected onRenderComplete(): void {
        // Move sentinel to the end
        if (this.sentinel && this.querySelector(".library-body")) {
             this.querySelector(".library-body")?.appendChild(this.sentinel);
        }
    }
}