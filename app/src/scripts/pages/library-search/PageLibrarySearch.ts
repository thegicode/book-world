import { LitElement, html } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { manageFocus } from "@/utils/helpers";
import { librarySearchStore, LibrarySearchState } from "@/model/LibrarySearchStore";
import "./LibrarySearchItem";
import "./LibrarySearchStored";

export default class PageLibrarySearch extends LitElement {
    private _state: LibrarySearchState;

    static properties = {
        _state: { state: true }
    };

    private observer: IntersectionObserver | null = null;

    constructor() {
        super();
        this._state = librarySearchStore.getState();
        this.initIntersectionObserver();
    }

    createRenderRoot() {
        return this; // Keep light DOM
    }

    connectedCallback() {
        super.connectedCallback();
        librarySearchStore.subscribe(this.handleStoreUpdate);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        librarySearchStore.unsubscribe(this.handleStoreUpdate);
        this.observer?.disconnect();
    }

    private handleStoreUpdate = (newState?: LibrarySearchState) => {
        if (!newState) return;
        const previousItemsLength = this._state.items.length;
        
        this._state = newState;
        
        // Focus management logic
        if (this._state.items.length > 0 && this._state.page === 1 && previousItemsLength === 0) {
            // Need to wait for DOM update
            this.updateComplete.then(() => {
                manageFocus(this, "library-search-item");
            });
        }
    };

    private initIntersectionObserver() {
        this.observer = new IntersectionObserver(this.handleIntersect, {
            root: null,
            rootMargin: "200px",
            threshold: 0,
        });
    }

    private handleIntersect = (entries: IntersectionObserverEntry[]) => {
        const entry = entries[0];
        if (entry.isIntersecting && !this._state.loading && librarySearchStore.hasMoreData()) {
            librarySearchStore.loadMore();
        }
    };

    private handleSearch = (e: Event) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const keyword = formData.get("keyword") as string;
        librarySearchStore.search(keyword);
    };

    protected updated() {
        this.updateSentinel();
    }

    private updateSentinel() {
        const sentinel = this.querySelector(".sentinel");
        if (sentinel && this.observer) {
            this.observer.unobserve(sentinel);
            if (librarySearchStore.hasMoreData() && !this._state.loading) {
                 this.observer.observe(sentinel);
            }
        }
    }

    render() {
        const { keyword, items, loading, error, hasSearched, total } = this._state;

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
                            .value="${keyword}"
                        />
                        <button type="submit">검색</button>
                    </form>
                </div>
            </section>

            <section class="results-area" aria-live="polite" aria-label="검색 결과">
                <div class="library-body">
                    <div class="library-list" role="list">
                        ${error
                            ? html`<div class="error-message" role="alert">
                                  ${error}
                              </div>`
                            : hasSearched && items.length === 0 && total === 0
                              ? html`<div class="no-data">데이터가 없습니다.</div>`
                              : repeat(
                                    items,
                                    (item) => item.libCode,
                                    (item) => html`
                                        <library-search-item
                                            .data=${item}
                                            class="virtual-item"
                                        ></library-search-item>
                                    `,
                                )}
                    </div>
                    ${loading ? html`<div class="loading">Loading...</div>` : ""}
                    <div class="sentinel" style="height: 10px; width: 100%;"></div>
                </div>
            </section>
        `;
    }
}

    