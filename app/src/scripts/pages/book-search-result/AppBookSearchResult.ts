export interface KakaoBookItem {
    title: string;
    link: string;
    image: string;
    author: string;
    publisher: string;
    pubdate: string;
    isbn: string;
    description?: string;
}

export default class AppBookSearchResult extends HTMLElement {
    private keyword = "";
    private books: KakaoBookItem[] = [];
    private totalCount = 0;
    private start = 1;
    private readonly displayCount: number = 20;
    private isLoading = false;
    private hasMore = true;

    private errorMessage = "";

    constructor() {
        super();
        this.parseQueryParams();
    }

    connectedCallback() {
        this.render();
        this.attachEvents();
        if (this.keyword) {
            this.fetchBooks(true);
        }
    }

    private parseQueryParams() {
        const urlParams = new URLSearchParams(window.location.search);
        this.keyword = urlParams.get("keyword") || urlParams.get("q") || "불편한 편의점";
    }

    private async fetchBooks(isInitial = false) {
        if (this.isLoading || (!isInitial && !this.hasMore)) return;

        this.isLoading = true;
        this.errorMessage = "";

        if (isInitial) {
            this.start = 1;
            this.books = [];
            this.renderLoading();
        }

        try {
            const url = `/search-kakao-book?keyword=${encodeURIComponent(this.keyword)}&display=${this.displayCount}&start=${this.start}&sort=sim`;
            const response = await fetch(url);
            const json = await response.json();

            if (response.ok && json.status === "success" && json.data) {
                const { total, items } = json.data;
                this.totalCount = total || 0;

                if (items && Array.isArray(items)) {
                    this.books = isInitial ? items : [...this.books, ...items];
                    this.start += items.length;
                    if (this.books.length >= this.totalCount || items.length < this.displayCount) {
                        this.hasMore = false;
                    }
                } else {
                    this.hasMore = false;
                }
            } else {
                this.hasMore = false;
                this.errorMessage = json.message || "카카오 도서 검색 API 호출에 실패하였습니다.";
            }
        } catch (error) {
            console.error("Failed to fetch Kakao books:", error);
            this.hasMore = false;
            this.errorMessage = "네트워크 통신 중 오류가 발생하였습니다.";
        } finally {
            this.isLoading = false;
            this.updateResultsUI();
        }
    }

    private render() {
        this.innerHTML = `
            <!-- Top Header -->
            <header class="search-header">
                <button type="button" class="btn-back" id="btnBack" aria-label="뒤로가기">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
                <h1 class="header-title">책 검색</h1>
            </header>

            <!-- Search Bar Card -->
            <div class="search-bar-card">
                <form id="resultSearchForm" class="search-input-form" autocomplete="off">
                    <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        id="resultSearchInput"
                        class="search-input"
                        value="${this.escapeHtml(this.keyword)}"
                        placeholder="책 제목, 작가, ISBN 검색"
                    />
                    <button type="button" class="btn-clear" id="btnClear" aria-label="검색어 지우기">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </form>
            </div>

            <!-- Results Info Bar -->
            <div class="results-info-bar">
                <span class="count-text" id="countText">검색 결과 ${this.totalCount}권</span>
                <span class="sort-text">도서 DB 제공: 카카오</span>
            </div>

            <!-- Book Results List -->
            <div class="book-results-list" id="bookListContainer">
                <div class="loading-state">검색 중입니다...</div>
            </div>

            <!-- Kakao Attribution Footer -->
            <footer class="kakao-footer-attribution">
                <p>도서 정보 제공 : Kakao Book API</p>
            </footer>
        `;
    }

    private updateResultsUI() {
        const countText = this.querySelector("#countText");
        if (countText) {
            countText.textContent = `검색 결과 ${this.totalCount}권`;
        }

        const container = this.querySelector("#bookListContainer");
        if (!container) return;

        if (this.errorMessage) {
            container.innerHTML = `
                <div class="empty-state">
                    <p style="margin-bottom: 8px; font-weight: 600; color: #d32f2f;">⚠️ ${this.escapeHtml(this.errorMessage)}</p>
                    <p style="font-size: 13px; color: var(--text-muted);">
                        카카오 개발자 센터 [내 애플리케이션] ➔ [앱 키]에서 <b>KAKAO_REST_KEY</b>가 올바르게 설정되어 있는지 확인해 주세요.
                    </p>
                </div>
            `;
            return;
        }

        if (this.books.length === 0) {
            container.innerHTML = `<div class="empty-state">검색 결과가 없습니다.</div>`;
            return;
        }

        container.innerHTML = this.books
            .map((book) => this.renderBookCardHtml(book))
            .join("");
    }

    private renderLoading() {
        const container = this.querySelector("#bookListContainer");
        if (container) {
            container.innerHTML = `<div class="loading-state">검색 중입니다...</div>`;
        }
    }

    private renderBookCardHtml(book: KakaoBookItem): string {
        const pubYear = book.pubdate ? book.pubdate.substring(0, 4) : "";
        const pubText = [book.publisher, pubYear].filter(Boolean).join(" · ");
        const isbnText = book.isbn ? `ISBN ${book.isbn}` : "";
        const coverImg = book.image || "/assets/images/favicon.ico";

        return `
            <article class="book-card" data-isbn="${book.isbn}">
                <div class="book-cover-wrapper">
                    <img src="${coverImg}" alt="${this.escapeHtml(this.stripHtml(book.title))}" class="book-cover-img" loading="lazy" />
                </div>
                <div class="book-info">
                    <h2 class="book-title">${book.title}</h2>
                    <div class="book-author">${book.author || "저자 미상"}</div>
                    <div class="book-meta">${pubText}</div>
                    ${isbnText ? `<div class="book-isbn">${isbnText}</div>` : ""}
                    <button type="button" class="btn-info-check" data-link="${book.link || "#"}">
                        도서 정보 확인
                    </button>
                </div>
            </article>
        `;
    }

    private attachEvents() {
        // 뒤로가기
        const btnBack = this.querySelector("#btnBack");
        btnBack?.addEventListener("click", () => {
            window.location.href = "/book-where";
        });

        // Clear 버튼
        const btnClear = this.querySelector("#btnClear");
        const input = this.querySelector("#resultSearchInput") as HTMLInputElement;

        btnClear?.addEventListener("click", () => {
            if (input) {
                input.value = "";
                input.focus();
            }
        });

        // 검색 제출
        const form = this.querySelector("#resultSearchForm");
        form?.addEventListener("submit", (e) => {
            e.preventDefault();
            if (input && input.value.trim()) {
                this.keyword = input.value.trim();
                // URL 업데이트
                window.history.replaceState(null, "", `/book-search-result?keyword=${encodeURIComponent(this.keyword)}`);
                this.fetchBooks(true);
            }
        });

        // 도서 정보 확인 클릭 위임
        const container = this.querySelector("#bookListContainer");
        container?.addEventListener("click", (e) => {
            const btn = (e.target as HTMLElement).closest(".btn-info-check");
            if (btn) {
                const link = btn.getAttribute("data-link");
                if (link && link !== "#") {
                    window.open(link, "_blank");
                }
            }
        });

        // 스크롤 감지 (무한 스크롤)
        this.addEventListener("scroll", () => {
            const threshold = 100; // 하단 100px 전
            if (this.scrollHeight - this.scrollTop - this.clientHeight < threshold) {
                this.fetchBooks(false);
            }
        });
    }

    private stripHtml(html: string): string {
        return html.replace(/<[^>]*>?/gm, "");
    }

    private escapeHtml(text: string): string {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}
