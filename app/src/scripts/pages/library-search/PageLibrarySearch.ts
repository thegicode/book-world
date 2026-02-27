import { LitElement, html } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { manageFocus, debounce } from "@/utils/helpers";
import { InfiniteScrollController } from "@/utils/InfiniteScrollController";
import { LibrarySearchController } from "./LibrarySearchController";
import "./LibrarySearchFavoriteList";
import "./LibrarySearchForm";

export default class PageLibrarySearch extends LitElement {
    private searchController: LibrarySearchController;
    private infiniteScroll: InfiniteScrollController;
    private debouncedSearch: (keyword: string) => void;

    constructor() {
        super();

        this.searchController = new LibrarySearchController(this);

        // 무한 스크롤
        this.infiniteScroll = new InfiniteScrollController(
            this,
            ".sentinel",
            () => this.searchController.loadMore()
        );

        // 실시간 검색 디바운싱 (300ms)
        this.debouncedSearch = debounce((keyword: string) => {
            this.handleSearchAction(keyword);
        }, 300);
    }

    createRenderRoot() {
        return this; // Keep light DOM
    }

    private async handleSearchAction(keyword: string) {
        await this.searchController.search(keyword);

        // 검색 완료 후 첫 페이지이고 결과가 있으면 포커스 이동
        if (this.searchController.items.length > 0) {
            this.updateComplete.then(() => {
                manageFocus(this, "library-search-item");
            });
        }
    }

    // Lit 생명주기: 상태 변경 후 무한 스크롤 정지/재개 판단
    updated() {
        this.infiniteScroll.setPaused(
            this.searchController.loading || !this.searchController.hasMoreData()
        );
    }

    // --- 이벤트 핸들러 ---

    private handleSearch = (e: Event) => {
        const customEvent = e as CustomEvent<{ keyword: string }>;
        this.handleSearchAction(customEvent.detail.keyword);
    };

    private handleInput = (e: Event) => {
        const customEvent = e as CustomEvent<{ keyword: string }>;
        this.debouncedSearch(customEvent.detail.keyword);
    };

    render() {
        const { items, loading, error, hasSearched, total } = this.searchController;

        return html`
            <section class="stored-libraries" aria-label="저장된 관심 도서관">
                <library-search-favorite-list></library-search-favorite-list>
            </section>

            <section class="search-area" aria-label="도서관 검색 영역">
                <library-search-form
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
                                  @retry="${() => this.searchController.retry()}">
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