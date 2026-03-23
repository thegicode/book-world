type TAvailabilityState = {
    libCode: string;
    libName: string;
    address?: string;
    homepage?: string;
    hasBook: string;
    loanAvailable: string;
    error?: string;
};

const BOOK_THUMBNAIL_PLACEHOLDER =
    "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2280%22%20height%3D%22114%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2080%20114%22%20preserveAspectRatio%3D%22none%22%3E%3Crect%20width%3D%2280%22%20height%3D%22114%22%20rx%3D%2212%22%20fill%3D%22%23efe5d6%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2210%22%20fill%3D%22%238f7b68%22%3EBOOK%3C%2Ftext%3E%3C%2Fsvg%3E";

export default class BookSideApp extends HTMLElement {
    private static readonly STORAGE_KEY = "book-side:selected-libraries";
    private static readonly RECENT_SEARCHES_KEY = "book-side:recent-searches";
    private static readonly RECENT_SEARCH_LIMIT = 5;

    private bookResults: ISearchBook[] = [];
    private libraryResults: ILibraryData[] = [];
    private selectedBook: ISearchBook | null = null;
    private selectedLibraries = new Map<string, ILibraryData>();
    private availabilityResults: TAvailabilityState[] = [];
    private availabilityRequestId = 0;
    private showAvailableOnly = false;
    private initialBookKeyword = "";
    private initialSelectedIsbn13 = "";
    private shareStatusMessage = "";
    private recentSearches: string[] = [];
    private desktopLayoutQuery = window.matchMedia("(min-width: 640px)");

    connectedCallback() {
        this.restoreUrlState();
        this.restoreSelectedLibraries();
        this.restoreRecentSearches();
        this.render();
        this.bindEvents();
        this.desktopLayoutQuery.addEventListener(
            "change",
            this.handleLayoutChange,
        );
        this.restoreInitialBookSearch();
    }

    private render() {
        this.innerHTML = `
            <main class="book-side">
                <section class="book-side-hero">
                    <h1 class="brand">책</h1>
                    <p class="hero-copy">
                        찾고 싶은 책을 고르고, 확인하고 싶은 도서관을 모아서,
                        소장 여부와 대출 가능 상태를 한 화면에서 확인합니다.
                    </p>
                    <ol class="flow-steps" aria-label="책 이용 단계">
                        <li><strong>1.</strong> 책 검색 후 결과에서 한 권 선택</li>
                        <li><strong>2.</strong> 도서관 검색 후 조회할 도서관 추가</li>
                        <li><strong>3.</strong> 선택한 도서관별 소장 및 대출 가능 여부 확인</li>
                    </ol>
                </section>
                <section class="book-side-workspace">
                    <div class="section-stack">
                        <section class="book-search-section">
                            <header class="panel-head">
                                    <h2>1. 도서 검색</h2>
                                    <p class="panel-copy">네이버 도서 검색 결과에서 조회할 책을 먼저 고릅니다.</p>
                            </header>
                            <form class="search-form" data-role="book-form">
                                <div class="search-row">
                                    <input
                                        type="search"
                                        name="keyword"
                                        placeholder="책 제목, 저자, 주제를 입력하세요"
                                        aria-label="도서 검색어"
                                        value="${this.escapeAttribute(this.initialBookKeyword)}"
                                        required
                                    />
                                    <button type="submit" class="submit-button">검색</button>
                                </div>
                            </form>
                            <div class="recent-searches"></div>
                            <div class="book-results"></div>
                        </section>
                        <section class="library-selection-section">
                            <div class="panel-head">
                                <header>
                                    <h2>2. 도서관 선택</h2>
                                    <p class="panel-copy">책을 고른 뒤 도서관명을 검색해서 조회 대상에 추가합니다.</p>
                                </header>
                                <div class="panel-actions">
                                    <span class="inline-label">선택 ${this.selectedLibraries.size}곳</span>
                                    ${
                                        this.selectedLibraries.size > 0
                                            ? '<button type="button" class="clear-button" data-role="clear-libraries">전체 비우기</button>'
                                            : ""
                                    }
                                </div>
                            </div>
                            <div class="selected-libraries"></div>
                            <form class="search-form" data-role="library-form">
                                <div class="search-row">
                                    <input
                                        type="search"
                                        name="keyword"
                                        placeholder="예: 강남, 서초, 중앙도서관"
                                        aria-label="도서관 검색어"
                                        required
                                    />
                                    <button type="submit" class="submit-button">찾기</button>
                                </div>
                            </form>
                            <div class="library-results"></div>
                        </section>
                    </div>
                    <aside class="book-side-summary summary-grid">
                        <section class="selected-book-section">
                            <header>
                                <h3>선택한 책</h3>
                                <button type="button" class="share-button" data-role="share-link">공유</button>
                            </header>
                            <div class="selected-book-panel"></div>
                            ${
                                this.shareStatusMessage
                                    ? `<p class="share-status" role="status" aria-live="polite">${this.escapeHtml(this.shareStatusMessage)}</p>`
                                    : ""
                            }
                        </section>
                        <section class="availability-section">
                            <div class="availability-head">
                                <div>
                                    <h3>3. 대출 가능 조회</h3>
                                    <p class="panel-copy">선택한 책과 도서관 기준으로 결과를 바로 확인합니다.</p>
                                </div>
                                <label class="filter-toggle">
                                    <input type="checkbox" data-role="available-only" ${this.showAvailableOnly ? "checked" : ""} />
                                    <span>대출 가능만 보기</span>
                                </label>
                            </div>
                            <p class="notice">
                                도서관 API 특성상 소장 여부는 비교적 정확하지만, 대출 가능 상태는 실제와 차이가 있을 수 있습니다.
                            </p>
                            <div class="availability-results"></div>
                        </section>
                    </aside>
                </section>
            </main>
        `;

        this.renderBookResults();
        this.renderLibraryResults();
        this.renderRecentSearches();
        this.renderSelectedLibraries();
        this.renderSelectedBook();
        this.renderAvailability();
        this.updateSelectedBookPlacement();
    }

    private bindEvents() {
        this.querySelector('[data-role="book-form"]')?.addEventListener(
            "submit",
            this.handleBookSearch,
        );
        this.querySelector('[data-role="library-form"]')?.addEventListener(
            "submit",
            this.handleLibrarySearch,
        );
        this.addEventListener("click", this.handleClick);
    }

    disconnectedCallback() {
        this.querySelector('[data-role="book-form"]')?.removeEventListener(
            "submit",
            this.handleBookSearch,
        );
        this.querySelector('[data-role="library-form"]')?.removeEventListener(
            "submit",
            this.handleLibrarySearch,
        );
        this.removeEventListener("click", this.handleClick);
        this.desktopLayoutQuery.removeEventListener(
            "change",
            this.handleLayoutChange,
        );
    }

    private handleLayoutChange = () => {
        this.updateSelectedBookPlacement();
    };

    private updateSelectedBookPlacement() {
        const selectedBookSection = this.querySelector(
            ".selected-book-section",
        );
        const sectionStack = this.querySelector(".section-stack");
        const librarySelectionSection = this.querySelector(
            ".library-selection-section",
        );
        const summary = this.querySelector(".book-side-summary");
        const availabilitySection = this.querySelector(".availability-section");

        if (
            !selectedBookSection ||
            !sectionStack ||
            !librarySelectionSection ||
            !summary ||
            !availabilitySection
        ) {
            return;
        }

        if (this.desktopLayoutQuery.matches) {
            summary.insertBefore(selectedBookSection, availabilitySection);
            return;
        }

        sectionStack.insertBefore(selectedBookSection, librarySelectionSection);
    }

    private handleBookSearch = async (event: Event) => {
        event.preventDefault();
        const form = event.currentTarget as HTMLFormElement;
        const keyword = this.readKeyword(form);
        if (!keyword) {
            return;
        }

        await this.searchBooks(keyword);
    };

    private handleLibrarySearch = async (event: Event) => {
        event.preventDefault();
        const form = event.currentTarget as HTMLFormElement;
        const keyword = this.readKeyword(form);
        if (!keyword) {
            return;
        }

        this.setLibraryResultsLoading();

        try {
            const result = await this.fetchData<ILibrarySearchByBookResult>(
                `/api/book-side/libraries?keyword=${encodeURIComponent(keyword)}&page=1&pageSize=10`,
            );
            this.libraryResults = result.libraries;
            this.renderLibraryResults();
        } catch (error) {
            this.renderLibraryResults(
                error instanceof Error
                    ? error.message
                    : "도서관 검색 중 오류가 발생했습니다.",
            );
        }
    };

    private handleClick = (event: Event) => {
        const target = event.target as HTMLElement;
        const bookButton =
            target.closest<HTMLButtonElement>("[data-book-index]");
        if (bookButton) {
            const index = Number(bookButton.dataset.bookIndex);
            this.selectedBook = this.bookResults[index] || null;
            this.renderBookResults();
            this.renderSelectedBook();
            this.syncUrlState();
            this.refreshAvailability();
            return;
        }

        const libraryButton = target.closest<HTMLButtonElement>(
            "[data-library-code]",
        );
        if (libraryButton) {
            const { libraryCode = "" } = libraryButton.dataset;
            const library = this.libraryResults.find(
                (item) => item.libCode === libraryCode,
            );
            if (!library) {
                return;
            }

            if (this.selectedLibraries.has(libraryCode)) {
                this.selectedLibraries.delete(libraryCode);
            } else {
                this.selectedLibraries.set(libraryCode, library);
            }

            this.persistSelectedLibraries();
            this.render();
            this.refreshAvailability();
            return;
        }

        const removeButton = target.closest<HTMLButtonElement>(
            "[data-remove-library]",
        );
        if (removeButton) {
            const { removeLibrary = "" } = removeButton.dataset;
            this.selectedLibraries.delete(removeLibrary);
            this.persistSelectedLibraries();
            this.render();
            this.refreshAvailability();
            return;
        }

        const clearButton = target.closest<HTMLButtonElement>(
            '[data-role="clear-libraries"]',
        );
        if (clearButton) {
            this.selectedLibraries.clear();
            this.persistSelectedLibraries();
            this.render();
            this.refreshAvailability();
            return;
        }

        const toggle = target.closest<HTMLInputElement>(
            '[data-role="available-only"]',
        );
        if (toggle) {
            this.showAvailableOnly = toggle.checked;
            this.syncUrlState();
            this.renderAvailability();
            return;
        }

        const shareButton = target.closest<HTMLButtonElement>(
            '[data-role="share-link"]',
        );
        if (shareButton) {
            void this.copyShareLink();
            return;
        }

        const recentSearchButton = target.closest<HTMLButtonElement>(
            "[data-recent-search]",
        );
        if (recentSearchButton) {
            const keyword = recentSearchButton.dataset.recentSearch || "";
            const input = this.querySelector<HTMLInputElement>(
                '[data-role="book-form"] input[name="keyword"]',
            );
            if (input) {
                input.value = keyword;
            }
            void this.searchBooks(keyword);
        }
    };

    private async refreshAvailability() {
        const currentRequestId = ++this.availabilityRequestId;
        this.availabilityResults = [];
        this.renderAvailability("loading");

        const isbn13 = this.extractIsbn13(this.selectedBook?.isbn || "");
        const libraries = [...this.selectedLibraries.values()];

        if (!this.selectedBook) {
            this.renderAvailability("book");
            return;
        }

        if (!isbn13) {
            this.renderAvailability("isbn");
            return;
        }

        if (libraries.length === 0) {
            this.renderAvailability("library");
            return;
        }

        const query = new URLSearchParams({
            isbn13,
            libCodes: libraries.map((library) => library.libCode).join(","),
        });

        let response: { libraries: TAvailabilityState[] };
        try {
            response = await this.fetchData<{
                libraries: TAvailabilityState[];
            }>(`/api/book-side/availability?${query.toString()}`);
        } catch (error) {
            if (currentRequestId !== this.availabilityRequestId) {
                return;
            }
            this.availabilityResults = libraries.map((library) => ({
                libCode: library.libCode,
                libName: library.libName,
                address: library.address,
                homepage: library.homepage,
                hasBook: "N",
                loanAvailable: "N",
                error:
                    error instanceof Error
                        ? error.message
                        : "대출 가능 조회 중 오류가 발생했습니다.",
            }));
            this.renderAvailability();
            return;
        }

        if (currentRequestId !== this.availabilityRequestId) {
            return;
        }

        this.availabilityResults = response.libraries.sort((a, b) => {
            const score = (item: TAvailabilityState) => {
                if (item.error) return 0;
                if (item.loanAvailable === "Y") return 3;
                if (item.hasBook === "Y") return 2;
                return 1;
            };
            return score(b) - score(a);
        });
        this.renderAvailability();
    }

    private renderBookResults(message?: string) {
        const container = this.querySelector(".book-results");
        if (!container) {
            return;
        }

        if (message) {
            container.innerHTML = `<div class="status-panel is-info" role="status" aria-live="polite"><p class="status-copy">${message}</p></div>`;
            return;
        }

        if (this.bookResults.length === 0) {
            container.innerHTML =
                '<div class="status-panel is-empty"><p class="empty-copy">책 제목이나 저자를 검색하면 결과 목록이 여기 표시됩니다.</p></div>';
            return;
        }

        container.innerHTML = `
            <ul class="result-list">
                ${this.bookResults
                    .map((book, index) => {
                        const isSelected =
                            this.selectedBook?.isbn === book.isbn;
                        return `
                            <li class="book-card">
                                <button type="button" data-book-index="${index}" aria-pressed="${isSelected}">
                                    <div class="book-card-layout">
                                        <img
                                            class="book-thumb"
                                            src="${this.escapeAttribute(book.image || BOOK_THUMBNAIL_PLACEHOLDER)}"
                                            alt="${this.escapeAttribute(this.stripMarkup(book.title))}"
                                            loading="lazy"
                                            onerror="this.onerror=null;this.src='${BOOK_THUMBNAIL_PLACEHOLDER}'"
                                        />
                                        <div class="book-copy">
                                            <h3 class="book-title">${this.escapeHtml(this.stripMarkup(book.title))}</h3>
                                            <p class="book-meta">${this.escapeHtml(this.stripMarkup(book.author || ""))}</p>
                                            <p class="book-meta">${this.escapeHtml(book.publisher)} · ${this.formatPubdate(book.pubdate)}</p>
                                        </div>
                                    </div>
                                </button>
                            </li>
                        `;
                    })
                    .join("")}
            </ul>
        `;
    }

    private renderLibraryResults(message?: string) {
        const container = this.querySelector(".library-results");
        const counter = this.querySelector(".inline-label");
        if (counter) {
            counter.textContent = `선택 ${this.selectedLibraries.size}곳`;
        }

        if (!container) {
            return;
        }

        if (message) {
            container.innerHTML = `<div class="status-panel is-info" role="status" aria-live="polite"><p class="status-copy">${message}</p></div>`;
            return;
        }

        if (this.libraryResults.length === 0) {
            container.innerHTML =
                '<div class="status-panel is-empty"><p class="empty-copy">도서관명을 검색해서 조회할 도서관을 추가하세요.</p></div>';
            return;
        }

        container.innerHTML = `
            <ul class="result-list">
                ${this.libraryResults
                    .map((library) => {
                        const isSelected = this.selectedLibraries.has(
                            library.libCode,
                        );
                        return `
                            <li class="library-card">
                                <button type="button" data-library-code="${library.libCode}" aria-pressed="${isSelected}">
                                    <h4 class="library-name">${this.escapeHtml(library.libName)}</h4>
                                    <p class="library-meta">${this.escapeHtml(library.address || "주소 정보 없음")}</p>
                                    <p class="library-meta">${this.escapeHtml(library.homepage || "홈페이지 정보 없음")}</p>
                                </button>
                            </li>
                        `;
                    })
                    .join("")}
            </ul>
        `;
    }

    private renderRecentSearches() {
        const container = this.querySelector(".recent-searches");
        if (!container) {
            return;
        }

        if (this.recentSearches.length === 0) {
            container.innerHTML = "";
            return;
        }

        container.innerHTML = `
            <div class="recent-search-group" role="group" aria-label="최근 검색어">
                ${this.recentSearches
                    .map(
                        (keyword) => `
                            <button type="button" class="recent-search-chip" data-recent-search="${this.escapeAttribute(keyword)}">${this.escapeHtml(keyword)}</button>
                        `,
                    )
                    .join("")}
            </div>
        `;
    }

    private renderSelectedLibraries() {
        const container = this.querySelector(".selected-libraries");
        if (!container) {
            return;
        }

        if (this.selectedLibraries.size === 0) {
            container.innerHTML = "";
            return;
        }

        container.innerHTML = `
            <ul class="selected-library-list">
                ${[...this.selectedLibraries.values()]
                    .map(
                        (library) => `
                            <li class="selected-library-chip">
                                <span>${this.escapeHtml(library.libName)}</span>
                                <button type="button" data-remove-library="${library.libCode}">제거</button>
                            </li>
                        `,
                    )
                    .join("")}
            </ul>
        `;
    }

    private renderSelectedBook() {
        const container = this.querySelector(".selected-book-panel");
        if (!container) {
            return;
        }

        if (!this.selectedBook) {
            container.innerHTML =
                '<div class="selected-book"><h4>선택된 책이 없습니다.</h4><p>왼쪽에서 책을 검색한 뒤 결과 목록에서 한 권을 선택하세요.</p></div>';
            return;
        }

        container.innerHTML = `
            <div class="selected-book book-card-layout">
                <img
                    class="book-thumb"
                    src="${this.escapeAttribute(this.selectedBook.image || BOOK_THUMBNAIL_PLACEHOLDER)}"
                    alt="${this.escapeAttribute(this.stripMarkup(this.selectedBook.title))}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='${BOOK_THUMBNAIL_PLACEHOLDER}'"
                />
                <div class="book-copy">
                    <h4 class="book-title">${this.escapeHtml(this.stripMarkup(this.selectedBook.title))}</h4>
                    <p class="book-meta">${this.escapeHtml(this.stripMarkup(this.selectedBook.author || ""))}</p>
                    <p class="book-meta">${this.escapeHtml(this.selectedBook.publisher)} · ${this.formatPubdate(this.selectedBook.pubdate)}</p>
                    <p class="book-meta">ISBN13 ${this.escapeHtml(this.extractIsbn13(this.selectedBook.isbn) || "정보 없음")}</p>
                </div>
            </div>
        `;
    }

    private renderAvailability(
        emptyState?: "loading" | "book" | "library" | "isbn",
    ) {
        const container = this.querySelector(".availability-results");
        if (!container) {
            return;
        }

        if (emptyState === "loading") {
            container.innerHTML =
                '<div class="status-panel is-info" role="status" aria-live="polite"><p class="status-copy">선택한 책과 도서관 기준으로 대출 가능 여부를 확인하고 있습니다.</p></div>';
            return;
        }

        if (emptyState === "book") {
            container.innerHTML =
                '<div class="status-panel is-empty"><p class="empty-copy">먼저 책을 선택하면 도서관별 대출 가능 여부를 확인할 수 있습니다.</p></div>';
            return;
        }

        if (emptyState === "library") {
            container.innerHTML =
                '<div class="status-panel is-empty"><p class="empty-copy">도서관을 한 곳 이상 선택하면 결과가 여기에 표시됩니다.</p></div>';
            return;
        }

        if (emptyState === "isbn") {
            container.innerHTML =
                '<div class="status-panel is-error"><p class="empty-copy">선택한 책의 ISBN13 정보를 찾지 못해 조회할 수 없습니다. 다른 책을 선택해 주세요.</p></div>';
            return;
        }

        if (this.availabilityResults.length === 0) {
            container.innerHTML =
                '<div class="status-panel is-empty"><p class="empty-copy">조회 결과가 여기에 표시됩니다.</p></div>';
            return;
        }

        const items = this.showAvailableOnly
            ? this.availabilityResults.filter(
                  (item) => item.loanAvailable === "Y" && !item.error,
              )
            : this.availabilityResults;

        if (items.length === 0) {
            container.innerHTML = this.showAvailableOnly
                ? '<div class="status-panel is-empty"><p class="empty-copy">현재 선택한 도서관 중 대출 가능한 곳이 없습니다. 필터를 해제하거나 다른 도서관을 추가해 보세요.</p></div>'
                : '<div class="status-panel is-empty"><p class="empty-copy">조회 결과가 여기에 표시됩니다.</p></div>';
            return;
        }

        container.innerHTML = `
            <ul class="availability-list">
                ${items
                    .map((item) => {
                        const state = this.getAvailabilityLabel(item);
                        return `
                            <li class="availability-card ${state.className}">
                                <div class="availability-top">
                                    <h4 class="library-name">${this.escapeHtml(item.libName)}</h4>
                                    <span class="availability-state ${state.className}">${state.label}</span>
                                </div>
                                <p class="availability-meta">소장 여부: ${item.hasBook === "Y" ? "소장" : "미소장"}</p>
                                <p class="availability-meta">${this.escapeHtml(item.address || "주소 정보 없음")}</p>
                                ${
                                    item.homepage
                                        ? `<p class="availability-action"><a href="${this.escapeHtml(item.homepage)}" target="_blank" rel="noreferrer">도서관 홈페이지 보기</a></p>`
                                        : ""
                                }
                                ${
                                    item.error
                                        ? `<p class="availability-meta">${this.escapeHtml(item.error)}</p>`
                                        : ""
                                }
                            </li>
                        `;
                    })
                    .join("")}
            </ul>
        `;
    }

    private getAvailabilityLabel(item: TAvailabilityState) {
        if (item.error) {
            return { label: "조회 실패", className: "is-error" };
        }
        if (item.loanAvailable === "Y") {
            return {
                label: "대출 가능",
                className: "is-available",
            };
        }
        if (item.hasBook === "Y") {
            return {
                label: "소장 중",
                className: "is-unavailable",
            };
        }
        return {
            label: "미소장",
            className: "is-missing",
        };
    }

    private setBookResultsLoading() {
        this.bookResults = [];
        this.selectedBook = null;
        this.renderBookResults("도서를 검색하고 있습니다.");
        this.renderSelectedBook();
        this.syncUrlState();
        this.renderAvailability("book");
    }

    private setLibraryResultsLoading() {
        this.libraryResults = [];
        this.renderLibraryResults("도서관을 검색하고 있습니다.");
    }

    private readKeyword(form: HTMLFormElement) {
        const input = form.querySelector<HTMLInputElement>(
            'input[name="keyword"]',
        );
        return input?.value.trim() || "";
    }

    private restoreSelectedLibraries() {
        try {
            const stored = localStorage.getItem(BookSideApp.STORAGE_KEY);
            if (!stored) {
                return;
            }

            const libraries = JSON.parse(stored) as ILibraryData[];
            libraries.forEach((library) => {
                if (library?.libCode) {
                    this.selectedLibraries.set(library.libCode, library);
                }
            });
        } catch (error) {
            console.error("Failed to restore selected libraries", error);
        }
    }

    private restoreRecentSearches() {
        try {
            const stored = localStorage.getItem(
                BookSideApp.RECENT_SEARCHES_KEY,
            );
            if (!stored) {
                return;
            }

            const parsed = JSON.parse(stored) as string[];
            this.recentSearches = parsed
                .filter(Boolean)
                .slice(0, BookSideApp.RECENT_SEARCH_LIMIT);
        } catch (error) {
            console.error("Failed to restore recent searches", error);
        }
    }

    private restoreUrlState() {
        const params = new URLSearchParams(window.location.search);
        this.initialBookKeyword = params.get("bookKeyword") || "";
        this.initialSelectedIsbn13 = params.get("isbn13") || "";
        this.showAvailableOnly = params.get("availableOnly") === "true";
    }

    private restoreInitialBookSearch() {
        if (!this.initialBookKeyword) {
            return;
        }

        void this.searchBooks(this.initialBookKeyword);
    }

    private persistSelectedLibraries() {
        try {
            localStorage.setItem(
                BookSideApp.STORAGE_KEY,
                JSON.stringify([...this.selectedLibraries.values()]),
            );
        } catch (error) {
            console.error("Failed to persist selected libraries", error);
        }
    }

    private syncUrlState() {
        const params = new URLSearchParams(window.location.search);
        const bookKeyword = this.readKeywordFromRole("book-form");
        const isbn13 = this.selectedBook
            ? this.extractIsbn13(
                  this.selectedBook.isbn13 || this.selectedBook.isbn,
              )
            : "";

        if (bookKeyword) {
            params.set("bookKeyword", bookKeyword);
        } else {
            params.delete("bookKeyword");
        }

        if (isbn13) {
            params.set("isbn13", isbn13);
        } else {
            params.delete("isbn13");
        }

        if (this.showAvailableOnly) {
            params.set("availableOnly", "true");
        } else {
            params.delete("availableOnly");
        }

        const query = params.toString();
        const nextUrl = query
            ? `${window.location.pathname}?${query}`
            : window.location.pathname;
        window.history.replaceState({}, "", nextUrl);
    }

    private readKeywordFromRole(role: string) {
        const form = this.querySelector<HTMLFormElement>(
            `[data-role="${role}"]`,
        );
        return form ? this.readKeyword(form) : "";
    }

    private async searchBooks(keyword: string) {
        this.setBookResultsLoading();

        try {
            this.persistRecentSearch(keyword);
            const result = await this.fetchData<ISearchNaverBookResult>(
                `/api/book-side/books?keyword=${encodeURIComponent(keyword)}&display=10&start=1&sort=sim`,
            );
            this.bookResults = result.items;
            this.selectedBook =
                result.items.find(
                    (item) =>
                        this.extractIsbn13(item.isbn13 || item.isbn) ===
                        this.initialSelectedIsbn13,
                ) ||
                result.items[0] ||
                null;
            this.renderBookResults();
            this.renderRecentSearches();
            this.renderSelectedBook();
            this.syncUrlState();
            this.refreshAvailability();
        } catch (error) {
            this.renderBookResults(
                error instanceof Error
                    ? error.message
                    : "도서 검색 중 오류가 발생했습니다.",
            );
        }
    }

    private persistRecentSearch(keyword: string) {
        const normalized = keyword.trim();
        if (!normalized) {
            return;
        }

        this.recentSearches = [
            normalized,
            ...this.recentSearches.filter((item) => item !== normalized),
        ].slice(0, BookSideApp.RECENT_SEARCH_LIMIT);

        try {
            localStorage.setItem(
                BookSideApp.RECENT_SEARCHES_KEY,
                JSON.stringify(this.recentSearches),
            );
        } catch (error) {
            console.error("Failed to persist recent searches", error);
        }
    }

    private async copyShareLink() {
        try {
            await navigator.clipboard.writeText(window.location.href);
            this.shareStatusMessage = "현재 화면 링크를 복사했습니다.";
        } catch (error) {
            console.error("Failed to copy share link", error);
            this.shareStatusMessage = "링크 복사에 실패했습니다.";
        }

        this.render();
        window.setTimeout(() => {
            this.shareStatusMessage = "";
            this.render();
        }, 2000);
    }

    private extractIsbn13(isbn: string) {
        if (/^\d{13}$/.test(isbn)) {
            return isbn;
        }
        const parts = isbn.split(/\s+/);
        return parts.find((part) => /^\d{13}$/.test(part)) || "";
    }

    private stripMarkup(text: string) {
        return text.replace(/<[^>]+>/g, "").trim();
    }

    private formatPubdate(pubdate: string) {
        if (!/^\d{8}$/.test(pubdate)) {
            return pubdate || "출간일 정보 없음";
        }
        return `${pubdate.slice(0, 4)}.${pubdate.slice(4, 6)}.${pubdate.slice(6, 8)}`;
    }

    private escapeHtml(text: string) {
        return text
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#39;");
    }

    private escapeAttribute(text: string) {
        return this.escapeHtml(text);
    }

    private async fetchData<T>(url: string): Promise<T> {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`요청 실패: ${response.status}`);
        }

        const payload = (await response.json()) as IApiResponse<T>;
        if (payload.status !== "success") {
            throw new Error(payload.message || "API 요청 실패");
        }

        return payload.data;
    }
}
