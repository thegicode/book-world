import { LitElement, html, PropertyValues } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { manageFocus, debounce } from "@/utils/helpers";
import bookModel from "@/model";
import { InfiniteScrollController } from "@/utils/InfiniteScrollController";
import { LibraryApiService } from "@/services";
import LibrarySearchItem from "./LibrarySearchItem";
import "./LibrarySearchFavoriteList";
import "./LibrarySearchForm";

export default class PageLibrarySearch extends LitElement {
    static properties = {
        keyword: { state: true },
        page: { state: true },
        pageSize: { state: true },
        total: { state: true },
        items: { state: true },
        loading: { state: true },
        error: { state: true },
        hasSearched: { state: true },
    };

    // 1. 로컬 상태 (Lit의 반응성 활용)
    private keyword = "";
    private page = 1;
    private pageSize = 20;
    private total = 0;
    private items: ILibraryData[] = [];
    private loading = false;
    private error: string | null = null;
    private hasSearched = false;

    private abortController: AbortController | null = null;
    private infiniteScroll: InfiniteScrollController;
    private debouncedSearch: (keyword: string) => void;

    constructor() {
        super();
        
        // 무한 스크롤
        this.infiniteScroll = new InfiniteScrollController(
            this,
            ".sentinel",
            () => this.loadMore()
        );
        
        // 실시간 검색 디바운싱 (300ms)
        this.debouncedSearch = debounce((keyword: string) => {
            this.search(keyword);
        }, 300);
    }

    createRenderRoot() {
        return this; // Keep light DOM
    }

    // --- 비즈니스 로직 (API 호출 및 상태 업데이트) ---

    private async search(keyword: string) {
        const trimmedKeyword = keyword.trim();
        if (!trimmedKeyword) return;

        // 이전 요청 취소
        if (this.abortController) {
            this.abortController.abort();
        }
        this.abortController = new AbortController();

        // 초기 상태 설정 (Lit이 자동으로 렌더링 스케줄링)
        this.keyword = trimmedKeyword;
        this.page = 1;
        this.items = [];
        this.total = 0;
        this.error = null;
        this.hasSearched = true;
        this.loading = true;

        await this.fetchData();

        // 검색 완료 후 첫 페이지이고 결과가 있으면 포커스 이동
        if (this.items.length > 0) {
            this.updateComplete.then(() => {
                manageFocus(this, "library-search-item");
            });
        }
    }

    private async loadMore() {
        if (this.loading || !this.hasMoreData()) return;

        this.page += 1;
        this.loading = true;
        await this.fetchData();
    }

    private retry() {
        if (this.loading) return;
        this.loading = true;
        this.error = null;
        this.fetchData();
    }

    private hasMoreData() {
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
        }
    }

    // Lit 생명주기: 상태 변경 후 무한 스크롤 정지/재개 판단
    updated(changedProperties: PropertyValues) {
        if (changedProperties.has("loading") || changedProperties.has("items")) {
            this.infiniteScroll.setPaused(this.loading || !this.hasMoreData());
        }
    }

    // --- 이벤트 핸들러 ---

    private handleSearch = (e: Event) => {
        const customEvent = e as CustomEvent<{ keyword: string }>;
        this.search(customEvent.detail.keyword);
    };

    private handleInput = (e: Event) => {
        const customEvent = e as CustomEvent<{ keyword: string }>;
        this.debouncedSearch(customEvent.detail.keyword);
    };

    private handleListChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target && target.name === "myLibrary") {
            const itemElement = target.closest("library-search-item") as LibrarySearchItem;
            if (!itemElement || !itemElement.data) return;

            const data = itemElement.data;
            if (target.checked) {
                bookModel.addLibraries(data.libCode, data);
            } else {
                bookModel.removeLibraries(data.libCode);
            }
        }
    };

    render() {
        return html`
            <section class="stored-libraries" aria-label="저장된 관심 도서관">
                <library-search-favorite-list></library-search-favorite-list>
            </section>

            <section class="search-area" aria-label="도서관 검색 영역">
                <library-search-form
                    .keyword="${this.keyword}"
                    @search="${this.handleSearch}"
                    @input-change="${this.handleInput}"
                ></library-search-form>
            </section>

            <section class="results-area" aria-live="polite" aria-label="검색 결과">
                <div class="library-body">
                    <div class="library-list" role="list" @change="${this.handleListChange}">
                        ${this.error
                            ? html`<error-fallback 
                                  message="${this.error}" 
                                  @retry="${() => this.retry()}">
                              </error-fallback>`
                            : this.hasSearched && this.items.length === 0 && this.total === 0
                              ? html`<div class="no-data">데이터가 없습니다.</div>`
                              : repeat(
                                    this.items,
                                    (item) => item.libCode,
                                    (item) => html`
                                        <library-search-item
                                            .data=${item}
                                            class="virtual-item"
                                        ></library-search-item>
                                    `,
                                )}
                    </div>
                    ${this.loading ? html`<div class="loading">Loading...</div>` : ""}
                    <div class="sentinel" style="height: 10px; width: 100%;"></div>
                </div>
            </section>
        `;
    }
}