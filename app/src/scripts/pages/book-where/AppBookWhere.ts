export interface RegionItem {
    id: string;
    name: string;
}

export const REGIONS: RegionItem[] = [
    { id: "gangdong", name: "서울 강동구" },
    { id: "gangnam", name: "서울 강남구" },
    { id: "songpa", name: "서울 송파구" },
    { id: "seocho", name: "서울 서초구" },
    { id: "mapo", name: "서울 마포구" },
    { id: "jongno", name: "서울 종로구" },
    { id: "seongbuk", name: "서울 성북구" },
    { id: "yongsan", name: "서울 용산구" },
    { id: "yeongdeungpo", name: "서울 영등포구" },
];

export default class AppBookWhere extends HTMLElement {
    private recentSearches: string[] = [];
    private selectedRegion = "서울 강동구";

    private readonly STORAGE_RECENT_KEY = "book_where_recent_searches";
    private readonly STORAGE_REGION_KEY = "book_where_region";

    constructor() {
        super();
        this.loadState();
    }

    connectedCallback() {
        this.render();
        this.attachEvents();
    }

    private loadState() {
        try {
            const savedSearches = localStorage.getItem(this.STORAGE_RECENT_KEY);
            if (savedSearches) {
                this.recentSearches = JSON.parse(savedSearches);
            } else {
                // 이미지와 동일한 기본 최근 검색어 설정
                this.recentSearches = ["불편한 편의점", "소년이 온다", "아몬드"];
                this.saveRecentSearches();
            }

            const savedRegion = localStorage.getItem(this.STORAGE_REGION_KEY);
            if (savedRegion) {
                this.selectedRegion = savedRegion;
            }
        } catch (e) {
            console.error("Failed to load state from localStorage:", e);
            this.recentSearches = ["불편한 편의점", "소년이 온다", "아몬드"];
        }
    }

    private saveRecentSearches() {
        try {
            localStorage.setItem(this.STORAGE_RECENT_KEY, JSON.stringify(this.recentSearches));
        } catch (e) {
            console.error("Failed to save recent searches:", e);
        }
    }

    private saveRegion(region: string) {
        try {
            this.selectedRegion = region;
            localStorage.setItem(this.STORAGE_REGION_KEY, region);
        } catch (e) {
            console.error("Failed to save region:", e);
        }
    }

    private addRecentSearch(keyword: string) {
        const trimmed = keyword.trim();
        if (!trimmed) return;

        // 중복 제거 후 맨 앞에 추가
        this.recentSearches = [
            trimmed,
            ...this.recentSearches.filter((item) => item !== trimmed),
        ].slice(0, 10); // 최대 10개 유지

        this.saveRecentSearches();
        this.updateRecentListUI();
    }

    private clearAllRecent() {
        this.recentSearches = [];
        this.saveRecentSearches();
        this.updateRecentListUI();
    }

    private executeSearch(keyword: string) {
        if (!keyword.trim()) return;
        this.addRecentSearch(keyword);
        // 책 검색 결과 페이지로 이동
        window.location.href = `/book-search-result?keyword=${encodeURIComponent(keyword)}`;
    }

    private render() {
        this.innerHTML = `
            <!-- Top Header -->
            <header class="page-header">
                <div class="header-titles">
                    <div class="sub-title">책 어디서 빌리지?</div>
                    <h1 class="main-title">읽고 싶은 책,<br />찾아볼까요?</h1>
                </div>
                <button class="header-icon-btn" aria-label="도서 메뉴" id="headerBookBtn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                </button>
            </header>

            <!-- Search Card Container -->
            <section class="search-container">
                <form id="searchForm" autocomplete="off">
                    <div class="search-input-wrapper">
                        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                            type="text"
                            id="searchInput"
                            class="search-input"
                            placeholder="책 제목, 작가, ISBN 검색"
                            aria-label="책 제목, 작가, ISBN 검색"
                        />
                    </div>
                    <button type="submit" class="btn-search-submit">책 검색하기</button>
                </form>
            </section>

            <!-- Location Filter Bar -->
            <div class="location-bar">
                <div class="location-label-group">
                    <svg class="target-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="6"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                    </svg>
                    <span>검색 지역</span>
                </div>
                <button type="button" class="location-select-btn" id="locationBtn">
                    <span id="locationText">${this.selectedRegion}</span>
                    <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>

            <!-- Recent Searches Section -->
            <section class="recent-search-section">
                <div class="recent-header">
                    <h2 class="recent-title">최근 검색</h2>
                    <button type="button" class="btn-clear-all" id="btnClearAll">전체 삭제</button>
                </div>
                <div class="recent-list-card" id="recentListCard">
                    ${this.renderRecentItemsHtml()}
                </div>
            </section>

            <!-- Info Banner Section -->
            <section class="info-banner-section">
                <h3 class="info-title">이런 책도 찾아보세요</h3>
                <p class="info-desc">책을 검색하면 가까운 도서관의 소장 여부를 확인 할 수 있어요.</p>
            </section>

            <!-- Region Selection Modal -->
            <div class="region-modal-backdrop" id="regionModal">
                <div class="region-modal-content">
                    <div class="modal-header">
                        <h3>검색 지역 선택</h3>
                        <button class="btn-close-modal" id="btnCloseModal" aria-label="닫기">&times;</button>
                    </div>
                    <div class="region-grid">
                        ${REGIONS.map(
                            (r) => `
                            <button
                                type="button"
                                class="region-btn ${r.name === this.selectedRegion ? "selected" : ""}"
                                data-region="${r.name}"
                            >
                                ${r.name}
                            </button>
                        `
                        ).join("")}
                    </div>
                </div>
            </div>
        `;
    }

    private renderRecentItemsHtml(): string {
        if (this.recentSearches.length === 0) {
            return `<div class="empty-recent">최근 검색어가 없습니다.</div>`;
        }

        return this.recentSearches
            .map(
                (keyword) => `
            <div class="recent-item" data-keyword="${keyword}">
                <div class="item-left">
                    <svg class="clock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span class="keyword-text">${keyword}</span>
                </div>
                <div class="item-right">
                    <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                </div>
            </div>
        `
            )
            .join("");
    }

    private updateRecentListUI() {
        const listCard = this.querySelector("#recentListCard");
        if (listCard) {
            listCard.innerHTML = this.renderRecentItemsHtml();
        }
    }

    private attachEvents() {
        // 검색 폼 제출
        const form = this.querySelector("#searchForm") as HTMLFormElement;
        const input = this.querySelector("#searchInput") as HTMLInputElement;

        form?.addEventListener("submit", (e) => {
            e.preventDefault();
            this.executeSearch(input.value);
        });

        // 최근 검색어 클릭 (위임)
        const listCard = this.querySelector("#recentListCard");
        listCard?.addEventListener("click", (e) => {
            const target = (e.target as HTMLElement).closest(".recent-item");
            if (target) {
                const keyword = target.getAttribute("data-keyword");
                if (keyword) {
                    this.executeSearch(keyword);
                }
            }
        });

        // 전체 삭제
        const btnClearAll = this.querySelector("#btnClearAll");
        btnClearAll?.addEventListener("click", () => {
            this.clearAllRecent();
        });

        // 상단 책 버튼 클릭 시 라이브러리/검색 페이지로 이동
        const headerBookBtn = this.querySelector("#headerBookBtn");
        headerBookBtn?.addEventListener("click", () => {
            window.location.href = "/search";
        });

        // 지역 선택 모달
        const locationBtn = this.querySelector("#locationBtn");
        const regionModal = this.querySelector("#regionModal");
        const btnCloseModal = this.querySelector("#btnCloseModal");

        locationBtn?.addEventListener("click", () => {
            regionModal?.classList.add("open");
        });

        btnCloseModal?.addEventListener("click", () => {
            regionModal?.classList.remove("open");
        });

        regionModal?.addEventListener("click", (e) => {
            if (e.target === regionModal) {
                regionModal.classList.remove("open");
            }
        });

        // 지역 버튼 선택 (위임)
        const regionGrid = this.querySelector(".region-grid");
        regionGrid?.addEventListener("click", (e) => {
            const btn = (e.target as HTMLElement).closest(".region-btn");
            if (btn) {
                const regionName = btn.getAttribute("data-region");
                if (regionName) {
                    this.saveRegion(regionName);

                    // UI 업데이트
                    const locationText = this.querySelector("#locationText");
                    if (locationText) locationText.textContent = regionName;

                    this.querySelectorAll(".region-btn").forEach((b) => {
                        b.classList.remove("selected");
                    });
                    btn.classList.add("selected");

                    // 모달 닫기
                    regionModal?.classList.remove("open");
                }
            }
        });
    }
}
