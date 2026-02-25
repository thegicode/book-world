import { html, render } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { CustomFetch } from "@/services";
import { manageFocus } from "@/utils/helpers";
import "./LibrarySearchItem";
import "./LibrarySearchStored";

export default class PageLibrarySearch extends HTMLElement {
    private _keyword = "";
    private _page = 1;
    private _pageSize = 20;
    private _total = 0;
    private _items: ILibraryData[] = [];
    private _loading = false;
    private _error: string | null = null;
    private _hasSearched = false;
    
    private abortController: AbortController | null = null;
    private observer: IntersectionObserver | null = null;

    constructor() {
        super();
        this.initIntersectionObserver();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {
        this.observer?.disconnect();
        this.abortController?.abort();
    }

    private initIntersectionObserver() {
        this.observer = new IntersectionObserver(this.handleIntersect, {
            root: null,
            rootMargin: "200px",
            threshold: 0,
        });
    }

    private handleIntersect = (entries: IntersectionObserverEntry[]) => {
        const entry = entries[0];
        if (entry.isIntersecting && !this._loading && this.hasMoreData()) {
            this.loadMore();
        }
    };

    private hasMoreData() {
        return this._items.length < this._total;
    }

    private handleSearch = async (e: Event) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const keyword = formData.get("keyword") as string;

        if (!keyword?.trim()) return;

        this._keyword = keyword.trim();
        this._page = 1;
        this._items = [];
        this._total = 0;
        this._error = null;
        this._hasSearched = true;
        
        if (this.abortController) {
            this.abortController.abort();
        }
        this.abortController = new AbortController();

        await this.fetchData();
    };

    private async loadMore() {
        this._page++;
        await this.fetchData();
    }

    private async fetchData() {
        if (this._loading) return;

        this._loading = true;
        this.render();

        const url = `/api/library-search-by-keyword?keyword=${encodeURIComponent(this._keyword)}&page=${this._page}&pageSize=${this._pageSize}`;

        try {
            const response = await CustomFetch.fetch<IApiResponse<ILibrarySearchByBookResult>>(url, {
                signal: this.abortController?.signal
            });

            if (response.status === 'success') {
                const data = response.data;
                const newItems = data.libraries || [];
                
                if (this._page === 1) {
                    this._items = newItems;
                } else {
                    this._items = [...this._items, ...newItems];
                }
                
                this._total = data.numFound || 0;
            } else {
                this._error = response.message || "API Error";
            }
        } catch (error: unknown) {
            if (error instanceof DOMException && error.name === "AbortError") {
                return;
            }
            console.error(error);
            this._error = "데이터를 불러오는 중 오류가 발생했습니다.";
        } finally {
            this._loading = false;
            this.render();
        }
    }

    private render() {
        render(this.template(), this);
        this.updateSentinel();
        
        // 검색 결과가 업데이트된 후 포커스 관리
        if (this._items.length > 0 && this._page === 1) {
            manageFocus(this, "library-search-item");
        }
    }

    private updateSentinel() {
        const sentinel = this.querySelector(".sentinel");
        if (sentinel && this.observer) {
            this.observer.unobserve(sentinel);
            if (this.hasMoreData() && !this._loading) {
                 this.observer.observe(sentinel);
            }
        }
    }

    private template() {
        return html`
            <section class="stored-libraries" aria-label="저장된 관심 도서관">
                <library-search-stored></library-search-stored>
            </section>

            <section class="search-area" aria-label="도서관 검색 영역">
                <div class="search-container">
                    <form class="search-form" role="search" @submit="${this.handleSearch}">
                        <label for="library-keyword" class="visually-hidden">도서관 이름</label>
                        <input 
                            type="text" 
                            id="library-keyword" 
                            name="keyword" 
                            placeholder="도서관 이름을 입력하세요" 
                            required 
                            .value="${this._keyword}"
                        />
                        <button type="submit">검색</button>
                    </form>
                </div>
            </section>

            <section class="results-area" aria-live="polite" aria-label="검색 결과">
                <div class="library-body">
                    <div class="library-list" role="list">
                        ${this._error
                            ? html`<div class="error-message" role="alert">
                                  ${this._error}
                              </div>`
                            : this._hasSearched && this._items.length === 0 && this._total === 0
                              ? html`<div class="no-data">데이터가 없습니다.</div>`
                              : repeat(
                                    this._items,
                                    (item) => item.libCode,
                                    (item) => html`
                                        <library-search-item
                                            .data=${item}
                                            class="virtual-item"
                                        ></library-search-item>
                                    `,
                                )}
                    </div>
                    ${this._loading ? html`<div class="loading">Loading...</div>` : ""}
                    <div class="sentinel" style="height: 10px; width: 100%;"></div>
                </div>
            </section>
        `;
    }

    }

    