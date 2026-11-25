import { CustomFetch } from "@/services";

interface ILibraryInfo {
    libCode: string;
    libName: string;
    address: string;
    tel: string;
    homepage: string;
    operatingTime?: string;
    closed?: string;
    latitude?: string;
    longitude?: string;
}

export default class BookWhereLibrary extends HTMLElement {
    private infoContainer: HTMLElement | null = null;
    private libCode: string | null = null;
    private bookTitle = "";
    private isbn = "";
    private hasBook = "Y";
    private loanAvailable = "Y";
    private distance = "1.2km";

    constructor() {
        super();
        this.parseQueryParams();
    }

    connectedCallback() {
        this.infoContainer = this.querySelector(".library-info-view");
        this.renderInfo();
    }

    private parseQueryParams() {
        const params = new URLSearchParams(window.location.search);
        this.libCode = params.get("libCode") || "111001";
        this.bookTitle = params.get("title") || "불편한 편의점";
        this.isbn = params.get("isbn") || "";
        this.hasBook = params.get("hasBook") || "Y";
        this.loanAvailable = params.get("loanAvailable") || "Y";
        this.distance = params.get("distance") || "1.2km";
    }

    private getLoanStatusBadge(): { statusClass: string; badgeText: string } {
        if (this.hasBook === "Y" && this.loanAvailable === "Y") {
            return { statusClass: "available", badgeText: "대출 가능" };
        }
        if (this.hasBook === "Y" && this.loanAvailable === "N") {
            return { statusClass: "loaned", badgeText: "대출 중" };
        }
        if (this.hasBook === "Y" && (this.loanAvailable === "CHECK" || this.loanAvailable === "UNKNOWN")) {
            return { statusClass: "need-check", badgeText: "확인 필요" };
        }
        return { statusClass: "no-info", badgeText: "소장 정보 없음" };
    }

    private async renderInfo() {
        if (!this.infoContainer) return;

        this.infoContainer.innerHTML = `<div class="loading-state">도서관 정보를 불러오는 중입니다...</div>`;

        let libData: ILibraryInfo = {
            libCode: this.libCode || "111001",
            libName: "강동구립 강동도서관",
            address: "서울특별시 강동구 아리수로 12",
            tel: "02-488-0000",
            homepage: "https://gdlib.or.kr",
            operatingTime: "09:00~18:00",
            closed: "매주 월요일",
        };

        try {
            const response = await CustomFetch.fetch<IApiResponse<ILibraryInfo>>(
                `/api/library-detail?libCode=${this.libCode}&isbn=${encodeURIComponent(this.isbn)}`
            );
            if (response.status === "success" && response.data) {
                const apiLib = response.data;
                libData = {
                    ...libData,
                    libName: apiLib.libName || libData.libName,
                    address: apiLib.address || libData.address,
                    tel: apiLib.tel || (apiLib as any).telephone || libData.tel,
                    homepage: apiLib.homepage || libData.homepage,
                    operatingTime: apiLib.operatingTime || "09:00~18:00",
                    closed: apiLib.closed || "매주 월요일",
                };
            }
        } catch (error) {
            console.warn("Failed to fetch library detail, using fallback mock data:", error);
        }

        const { statusClass, badgeText } = this.getLoanStatusBadge();
        const now = new Date();
        const confirmTimeText = `데이터 확인 시각 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const kakaoNaviUrl = `https://map.kakao.com/link/search/${encodeURIComponent(libData.libName)}`;
        const phoneCallUrl = libData.tel ? `tel:${libData.tel.replace(/[^\d-]/g, '')}` : '#';

        this.infoContainer.innerHTML = `
            <!-- Top Header Bar -->
            <header class="page-header">
                <button type="button" class="btn-back" id="btnBack" aria-label="뒤로가기">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
                <h1 class="header-title">도서관 정보</h1>
            </header>

            <!-- Image Gallery Banner -->
            <div class="gallery-container">
                <div class="gallery-item">
                    <img src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=500&auto=format&fit=crop" alt="도서관 전경" />
                </div>
                <div class="gallery-item">
                    <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&auto=format&fit=crop" alt="도서관 열람실" />
                </div>
                <div class="gallery-item">
                    <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=500&auto=format&fit=crop" alt="도서관 서가" />
                </div>
            </div>

            <!-- Library Base Info Header -->
            <div class="lib-basic-info">
                <h2 class="lib-title">${this.escapeHtml(libData.libName)}</h2>
                <div class="lib-address">${this.escapeHtml(libData.address)}</div>
                <div class="lib-distance">
                    <svg class="location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <span>내 위치에서 ${this.escapeHtml(this.distance)}</span>
                </div>
            </div>

            <!-- Card 1: Book Loan Status -->
            <div class="info-card" data-isbn="${this.escapeHtml(this.isbn)}">
                <h3 class="card-section-title">이 책의 대출 상태</h3>
                <div class="status-badge-wrap">
                    <span class="status-badge ${statusClass}">${badgeText}</span>
                </div>
                <div class="book-target-title">${this.escapeHtml(this.bookTitle)}</div>
                <div class="confirm-time-text">${confirmTimeText}</div>
            </div>

            <!-- Card 2: Library Operational Info -->
            <div class="info-card">
                <h3 class="card-section-title">도서관 이용 정보</h3>
                <dl class="use-info-list">
                    <div class="info-row">
                        <dt>운영시간</dt>
                        <dd>${this.escapeHtml(libData.operatingTime || "09:00~18:00")}</dd>
                    </div>
                    <div class="info-row">
                        <dt>휴관일</dt>
                        <dd>${this.escapeHtml(libData.closed || "매주 월요일")}</dd>
                    </div>
                    <div class="info-row">
                        <dt>전화</dt>
                        <dd><a href="${phoneCallUrl}" class="phone-link">${this.escapeHtml(libData.tel)}</a></dd>
                    </div>
                </dl>
            </div>

            <!-- Main Bottom Action Buttons -->
            <div class="action-buttons-group">
                <a href="${kakaoNaviUrl}" target="_blank" class="btn-action-primary">
                    <span>길찾기</span>
                </a>
                <a href="${libData.homepage || '#'}" target="_blank" rel="noopener noreferrer" class="btn-action-secondary">
                    <span>도서관 홈페이지</span>
                </a>
            </div>
        `;

        // Event Attachment
        const btnBack = this.querySelector("#btnBack");
        btnBack?.addEventListener("click", () => {
            window.history.back();
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