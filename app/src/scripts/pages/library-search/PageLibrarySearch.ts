import { LitElement, html } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { manageFocus, debounce } from "@/utils/helpers";
import { librarySearchStore, LibrarySearchState } from "@/model/LibrarySearchStore";
import bookModel, { BookModelEvent } from "@/model";
import { InfiniteScrollController } from "@/utils/InfiniteScrollController";
import { StoreController } from "@/utils/StoreController";
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
        
        // 전역 관심 도서관 모델 단일 구독 (O(1) 구독 아키텍처 적용)
        new StoreController(this, bookModel.getPublisher(BookModelEvent.LibraryUpdate));

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

        // 로컬 스토어를 Reactive Controller에 위임하여 생명주기 보일러플레이트 제거
        new StoreController(this, librarySearchStore, this.handleStoreUpdate);
    }

    createRenderRoot() {
        return this; // Keep light DOM
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

    // Event Delegation for list items
    private handleListChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target && target.name === "myLibrary") {
            const itemElement = target.closest("library-search-item") as any;
            if (!itemElement || !itemElement.data) return;

            const data = itemElement.data as ILibraryData;
            const isChecked = target.checked;

            if (isChecked) {
                bookModel.addLibraries(data.libCode, data);
            } else {
                bookModel.removeLibraries(data.libCode);
            }
        }
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
                    <div class="library-list" role="list" @change="${this.handleListChange}">
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
                                            .selected=${bookModel.hasLibrary(item.libCode)}
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

    