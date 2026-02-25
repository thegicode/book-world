import { LitElement, html } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { manageFocus, debounce } from "@/utils/helpers";
import { librarySearchStore, LibrarySearchState } from "@/model/LibrarySearchStore";
import { InfiniteScrollController } from "@/utils/InfiniteScrollController";
import "./LibrarySearchItem";
import "./LibrarySearchStored";
import "./LibrarySearchForm";

export default class PageLibrarySearch extends LitElement {
    private _state: LibrarySearchState;
    private infiniteScroll: InfiniteScrollController;
    private debouncedSearch: (keyword: string) => void;

    static properties = {
        _state: { state: true }
    };

    constructor() {
        super();
        this._state = librarySearchStore.getState();
        
        // Infinite Scroll Controller 초기화
        this.infiniteScroll = new InfiniteScrollController(
            this,
            ".sentinel",
            () => librarySearchStore.loadMore()
        );
        
        // 타이핑 시 실시간 검색을 위한 디바운싱 초기화 (300ms)
        this.debouncedSearch = debounce((keyword: string) => {
            librarySearchStore.search(keyword);
        }, 300);
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
    }

    private handleStoreUpdate = (newState?: LibrarySearchState) => {
        if (!newState) return;
        const previousItemsLength = this._state.items.length;
        
        this._state = newState;
        
        // 데이터 상태에 따라 무한 스크롤 감시 여부 조절
        this.infiniteScroll.setPaused(
            this._state.loading || !librarySearchStore.hasMoreData()
        );
        
        // Focus management logic
        if (this._state.items.length > 0 && this._state.page === 1 && previousItemsLength === 0) {
            this.updateComplete.then(() => {
                manageFocus(this, "library-search-item");
            });
        }
    };

    private handleSearch = (e: Event) => {
        const customEvent = e as CustomEvent<{ keyword: string }>;
        librarySearchStore.search(customEvent.detail.keyword);
    };

    private handleInput = (e: Event) => {
        const customEvent = e as CustomEvent<{ keyword: string }>;
        this.debouncedSearch(customEvent.detail.keyword);
    };

    render() {
        const { keyword, items, loading, error, hasSearched, total } = this._state;

        return html`
            <section class="stored-libraries" aria-label="저장된 관심 도서관">
                <library-search-stored></library-search-stored>
            </section>

            <section class="search-area" aria-label="도서관 검색 영역">
                <library-search-form
                    .keyword="${keyword}"
                    @search="${this.handleSearch}"
                    @input-change="${this.handleInput}"
                ></library-search-form>
            </section>

            <section class="results-area" aria-live="polite" aria-label="검색 결과">
                <div class="library-body">
                    <div class="library-list" role="list">
                        ${error
                            ? html`<error-fallback 
                                  message="${error}" 
                                  @retry="${() => librarySearchStore.retry()}">
                              </error-fallback>`
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

    