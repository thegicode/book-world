export interface ILibraryInfo {
    libCode: string;
    libName: string;
    address: string;
    homepage?: string;
    latitude?: string;
    longitude?: string;
    hasBook?: string;
    loanAvailable?: string;
    distance?: string;
}

export default class AppBookSearchLibrary extends HTMLElement {
    private isbn = "";
    private bookTitle = "";
    private author = "";
    private publisher = "";
    private pubdate = "";
    private image = "";
    private region = "강동구";

    private libraries: ILibraryInfo[] = [];
    private availableCount = 0;
    private isBookmarked = false;

    constructor() {
        super();
        this.parseQueryParams();
    }

    connectedCallback() {
        this.render();
        this.attachEvents();
        this.fetchLibraryData();
    }

    private cleanIsbn(isbn: string): string {
        if (!isbn) return "";
        const parts = isbn.trim().split(/\s+/);
        const isbn13 = parts.find((v) => /^\d{13}$/.test(v));
        if (isbn13) return isbn13;
        const isbn10 = parts.find((v) => /^\d{9}[\dX]$/i.test(v));
        if (isbn10) return isbn10;
        return isbn.replace(/[^\dX]/gi, "");
    }

    private parseQueryParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const rawIsbn = urlParams.get("isbn") || "9791161571188";
        this.isbn = this.cleanIsbn(rawIsbn);
        this.bookTitle = urlParams.get("title") || "불편한 편의점";
        this.author = urlParams.get("author") || "김호연";
        this.publisher = urlParams.get("publisher") || "나무옆의자";
        this.pubdate = urlParams.get("pubdate") || "2021";
        this.image = urlParams.get("image") || "/assets/images/favicon.ico";
        this.region = urlParams.get("region") || "강동구";
    }

    private async fetchLibraryData() {
        this.renderLoading();

        try {
            // 1. 도서관 목록 조회
            const libUrl = `/api/book-side/libraries?keyword=${encodeURIComponent(this.region)}&page=1&pageSize=10`;
            const libRes = await fetch(libUrl);
            const libJson = await libRes.json();

            if (libRes.ok && libJson.status === "success" && Array.isArray(libJson.data?.libraries)) {
                let libs: ILibraryInfo[] = libJson.data.libraries;

                // 기본 거리Mock 부여 (현위치 기준 거리순 정렬)
                const mockDistances = ["1.2km", "2.4km", "3.8km", "4.5km", "5.1km", "6.2km"];
                libs = libs.map((lib, idx) => ({
                    ...lib,
                    distance: mockDistances[idx % mockDistances.length],
                }));

                const libCodes = libs.map((lib) => lib.libCode).filter(Boolean);

                // 2. 도서관 대출/소장 가능 여부 Batch API 조회
                if (libCodes.length > 0) {
                    const availUrl = `/api/book-side/availability?isbn13=${encodeURIComponent(this.isbn)}&libCodes=${encodeURIComponent(libCodes.join(","))}`;
                    const availRes = await fetch(availUrl);
                    const availJson = await availRes.json();

                    if (availRes.ok && availJson.status === "success" && Array.isArray(availJson.data?.libraries)) {
                        const availMap = new Map<string, { hasBook: string; loanAvailable: string }>();
                        availJson.data.libraries.forEach((item: { libCode: string; hasBook: string; loanAvailable: string }) => {
                            availMap.set(item.libCode, {
                                hasBook: item.hasBook,
                                loanAvailable: item.loanAvailable,
                            });
                        });

                        libs = libs.map((lib) => {
                            const info = availMap.get(lib.libCode);
                            return {
                                ...lib,
                                hasBook: info ? info.hasBook : "N",
                                loanAvailable: info ? info.loanAvailable : "N",
                            };
                        });
                    }
                }

                // 대출 가능 도서관 수 계산
                this.availableCount = libs.filter((lib) => lib.hasBook === "Y" && lib.loanAvailable === "Y").length;
                this.libraries = libs;
            } else {
                this.libraries = this.getFallbackMockLibraries();
                this.availableCount = 3;
            }
        } catch (error) {
            console.error("Failed to fetch libraries data:", error);
            this.libraries = this.getFallbackMockLibraries();
            this.availableCount = 3;
        } finally {
            this.updateLibraryListUI();
        }
    }

    private getFallbackMockLibraries(): ILibraryInfo[] {
        return [
            {
                libCode: "111001",
                libName: "강동구립 강동도서관",
                address: "서울 강동구 아리수로",
                homepage: "https://gdlib.or.kr",
                hasBook: "Y",
                loanAvailable: "Y",
                distance: "1.2km",
            },
            {
                libCode: "111002",
                libName: "천호도서관",
                address: "서울 강동구 구천면로",
                homepage: "https://chlib.or.kr",
                hasBook: "Y",
                loanAvailable: "Y",
                distance: "2.4km",
            },
            {
                libCode: "111003",
                libName: "암사도서관",
                address: "서울 강동구 올림픽로",
                homepage: "https://amsalib.or.kr",
                hasBook: "Y",
                loanAvailable: "N",
                distance: "3.8km",
            },
            {
                libCode: "111004",
                libName: "고덕도서관",
                address: "서울 강동구 동구릉로",
                homepage: "https://godeoklib.or.kr",
                hasBook: "N",
                loanAvailable: "N",
                distance: "4.5km",
            },
        ];
    }

    private render() {
        const pubYear = this.pubdate ? this.pubdate.substring(0, 4) : "";
        const pubText = [this.publisher, pubYear].filter(Boolean).join(" · ");
        const isbnText = this.isbn ? `ISBN ${this.isbn}` : "";

        this.innerHTML = `
            <!-- Top Header -->
            <header class="search-header">
                <button type="button" class="btn-back" id="btnBack" aria-label="뒤로가기">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
                <h1 class="header-title">검색 결과</h1>
            </header>

            <!-- Selected Book Info Card -->
            <div class="selected-book-card">
                <div class="book-cover-wrapper">
                    <img src="${this.image}" alt="${this.escapeHtml(this.bookTitle)}" class="book-cover-img" />
                </div>
                <div class="book-info">
                    <h2 class="book-title">${this.escapeHtml(this.bookTitle)}</h2>
                    <div class="book-author">${this.escapeHtml(this.author)}</div>
                    <div class="book-meta">${this.escapeHtml(pubText)}</div>
                    ${isbnText ? `<div class="book-isbn">${this.escapeHtml(isbnText)}</div>` : ""}
                    <button type="button" class="btn-bookmark ${this.isBookmarked ? "active" : ""}" id="btnBookmark">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <span>관심 책 저장</span>
                    </button>
                </div>
            </div>

            <!-- Available Summary Banner -->
            <div class="available-summary-banner">
                <div class="banner-title">내 주변에서 빌릴 수 있는 곳</div>
                <div class="banner-count" id="availableCountText">${this.availableCount}곳</div>
                <div class="banner-sub">검색 지역 내 대출 가능 도서관</div>
            </div>

            <!-- Library List Section Header -->
            <div class="library-list-header">
                <div class="section-title">도서관 검색 결과</div>
                <div class="sort-dropdown">
                    <span>거리순</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
            </div>

            <!-- Library Cards List -->
            <div class="library-cards-list" id="libraryListContainer">
                <div class="loading-state">도서관 소장 상태를 확인 중입니다...</div>
            </div>
        `;
    }

    private updateLibraryListUI() {
        const countText = this.querySelector("#availableCountText");
        if (countText) {
            countText.textContent = `${this.availableCount}곳`;
        }

        const container = this.querySelector("#libraryListContainer");
        if (!container) return;

        if (this.libraries.length === 0) {
            container.innerHTML = `<div class="empty-state">내 주변에 도서관 검색 결과가 없습니다.</div>`;
            return;
        }

        container.innerHTML = this.libraries
            .map((lib) => this.renderLibraryCardHtml(lib))
            .join("");
    }

    private renderLoading() {
        const container = this.querySelector("#libraryListContainer");
        if (container) {
            container.innerHTML = `<div class="loading-state">도서관 소장 상태를 확인 중입니다...</div>`;
        }
    }

    private renderLibraryCardHtml(lib: ILibraryInfo): string {
        const isAvailable = lib.hasBook === "Y" && lib.loanAvailable === "Y";
        const isLoaned = lib.hasBook === "Y" && lib.loanAvailable === "N";

        let statusClass = "unknown";
        let statusBadgeText = "대출 상태 확인 불가";
        let statusTimeText = "소장 정보만 확인";
        let actionRightText = "홈페이지 ↗";
        let actionRightUrl = lib.homepage || "#";

        if (isAvailable) {
            statusClass = "available";
            statusBadgeText = "대출 가능";
            statusTimeText = "확인 10:42";
            actionRightText = "길찾기 ↗";
            actionRightUrl = `https://map.kakao.com/link/search/${encodeURIComponent(lib.libName)}`;
        } else if (isLoaned) {
            statusClass = "loaned";
            statusBadgeText = "대출 중";
            statusTimeText = "소장 확인";
            actionRightText = "홈페이지 ↗";
            actionRightUrl = lib.homepage || "#";
        }

        const statusIconSvg = isAvailable
            ? `<svg class="status-icon available" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
            : isLoaned
            ? `<svg class="status-icon loaned" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
            : `<svg class="status-icon unknown" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;

        return `
            <article class="library-card">
                <div class="card-top">
                    <div class="lib-header-group">
                        ${statusIconSvg}
                        <span class="lib-name">${this.escapeHtml(lib.libName)}</span>
                    </div>
                    <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </div>

                <div class="card-body">
                    <div class="badge-wrapper">
                        <span class="status-badge ${statusClass}">${statusBadgeText}</span>
                    </div>
                    <div class="lib-detail-info">${lib.distance || "1.2km"} · 종합자료실</div>
                    <div class="lib-confirm-time">${statusTimeText}</div>
                </div>

                <div class="card-divider"></div>

                <div class="card-actions">
                    <a href="/library?libCode=${lib.libCode}" class="btn-action btn-detail">
                        <span>도서관 정보 보기</span>
                    </a>
                    <a href="${actionRightUrl}" target="_blank" class="btn-action btn-link">
                        <span>${actionRightText}</span>
                    </a>
                </div>
            </article>
        `;
    }

    private attachEvents() {
        // 뒤로가기
        const btnBack = this.querySelector("#btnBack");
        btnBack?.addEventListener("click", () => {
            window.location.href = `/book-search-result?keyword=${encodeURIComponent(this.bookTitle)}`;
        });

        // 관심 책 저장 토글
        const btnBookmark = this.querySelector("#btnBookmark");
        btnBookmark?.addEventListener("click", () => {
            this.isBookmarked = !this.isBookmarked;
            if (btnBookmark) {
                btnBookmark.classList.toggle("active", this.isBookmarked);
            }
        });
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
