import {
    STORAGE_KEYS,
    DEFAULT_SETTINGS,
    REGIONS,
    RADIUS_OPTIONS,
    SORT_OPTIONS,
    NOTIFICATION_OPTIONS,
} from "./constants";
import { showToast } from "@/utils/toast";

export default class AppBookWhereSetting extends HTMLElement {
    private region: string = DEFAULT_SETTINGS.REGION;
    private radius: string = DEFAULT_SETTINGS.RADIUS;
    private sort: string = DEFAULT_SETTINGS.SORT;
    private notification: string = DEFAULT_SETTINGS.NOTIFICATION;

    constructor() {
        super();
        this.loadSettings();
    }

    connectedCallback() {
        this.render();
        this.attachEvents();
    }

    private loadSettings() {
        try {
            const savedRegion = localStorage.getItem(STORAGE_KEYS.REGION);
            if (savedRegion) {
                this.region = savedRegion.startsWith("서울 ") && !savedRegion.startsWith("서울특별시")
                    ? savedRegion.replace("서울 ", "서울특별시 ")
                    : savedRegion;
            } else {
                localStorage.setItem(STORAGE_KEYS.REGION, this.region);
            }

            const savedRadius = localStorage.getItem(STORAGE_KEYS.RADIUS);
            if (savedRadius) {
                this.radius = savedRadius;
            } else {
                localStorage.setItem(STORAGE_KEYS.RADIUS, this.radius);
            }

            const savedSort = localStorage.getItem(STORAGE_KEYS.SORT);
            if (savedSort) {
                this.sort = savedSort;
            } else {
                localStorage.setItem(STORAGE_KEYS.SORT, this.sort);
            }

            const savedNoti = localStorage.getItem(STORAGE_KEYS.NOTIFICATION);
            if (savedNoti) {
                this.notification = savedNoti;
            } else {
                localStorage.setItem(STORAGE_KEYS.NOTIFICATION, this.notification);
            }
        } catch (e) {
            console.error("Failed to load setting state:", e);
        }
    }

    private saveSetting(key: string, value: string) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.error(`Failed to save ${key}:`, e);
        }
    }

    private render() {
        this.innerHTML = `
            <main>
                <!-- Page Header -->
                <header class="page-header">
                    <div class="header-titles">
                        <h1 class="main-title">설정</h1>
                        <p class="sub-desc">검색 환경을 설정하세요.</p>
                    </div>
                </header>

                <!-- Setting Cards List -->
                <section class="setting-card-list">
                    <!-- 1. 검색 지역 -->
                    <div class="setting-card" data-setting-type="region" role="button" tabindex="0">
                        <div class="card-left">
                            <div class="card-icon-wrapper">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                            </div>
                            <div class="card-info">
                                <h2 class="card-title">검색 지역</h2>
                                <p class="card-sub" id="regionSubText">${this.region}</p>
                            </div>
                        </div>
                        <div class="card-right">
                            <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                    </div>

                    <!-- 2. 검색 범위 -->
                    <div class="setting-card" data-setting-type="radius" role="button" tabindex="0">
                        <div class="card-left">
                            <div class="card-icon-wrapper">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                    <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                                </svg>
                            </div>
                            <div class="card-info">
                                <h2 class="card-title">검색 범위</h2>
                                <p class="card-sub" id="radiusSubText">${this.radius}</p>
                            </div>
                        </div>
                        <div class="card-right">
                            <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                    </div>

                    <!-- 3. 검색 결과 정렬 -->
                    <div class="setting-card" data-setting-type="sort" role="button" tabindex="0">
                        <div class="card-left">
                            <div class="card-icon-wrapper">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="4" y1="21" x2="4" y2="14"></line>
                                    <line x1="4" y1="10" x2="4" y2="3"></line>
                                    <line x1="12" y1="21" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12" y2="3"></line>
                                    <line x1="20" y1="21" x2="20" y2="16"></line>
                                    <line x1="20" y1="12" x2="20" y2="3"></line>
                                    <line x1="1" y1="14" x2="7" y2="14"></line>
                                    <line x1="9" y1="8" x2="15" y2="8"></line>
                                    <line x1="17" y1="16" x2="23" y2="16"></line>
                                </svg>
                            </div>
                            <div class="card-info">
                                <h2 class="card-title">검색 결과 정렬</h2>
                                <p class="card-sub" id="sortSubText">${this.sort}</p>
                            </div>
                        </div>
                        <div class="card-right">
                            <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                    </div>

                    <!-- 4. 알림 -->
                    <div class="setting-card" data-setting-type="notification" role="button" tabindex="0">
                        <div class="card-left">
                            <div class="card-icon-wrapper">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                </svg>
                            </div>
                            <div class="card-info">
                                <h2 class="card-title">알림</h2>
                                <p class="card-sub" id="notificationSubText">${this.notification}</p>
                            </div>
                        </div>
                        <div class="card-right">
                            <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                    </div>

                    <!-- 5. 앱 정보 -->
                    <div class="setting-card" data-setting-type="info" role="button" tabindex="0">
                        <div class="card-left">
                            <div class="card-icon-wrapper">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                            </div>
                            <div class="card-info">
                                <h2 class="card-title">앱 정보</h2>
                                <p class="card-sub">${DEFAULT_SETTINGS.APP_INFO}</p>
                            </div>
                        </div>
                        <div class="card-right">
                            <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                    </div>
                </section>
            </main>

            <!-- Setting Selection Modal Backdrop -->
            <div class="setting-modal-backdrop" id="settingModal">
                <div class="setting-modal-content">
                    <div class="modal-header">
                        <h3 id="modalTitle">설정 변경</h3>
                        <button class="btn-close-modal" id="btnCloseModal" aria-label="닫기">&times;</button>
                    </div>
                    <div class="modal-body" id="modalBody">
                        <!-- Dynamic modal content -->
                    </div>
                </div>
            </div>
        `;
    }

    private attachEvents() {
        const cardList = this.querySelector(".setting-card-list");
        cardList?.addEventListener("click", (e) => {
            const card = (e.target as HTMLElement).closest(".setting-card");
            if (card) {
                const type = card.getAttribute("data-setting-type");
                if (type) {
                    this.openModal(type);
                }
            }
        });

        cardList?.addEventListener("keydown", (e) => {
            const keyEvent = e as KeyboardEvent;
            if (keyEvent.key === "Enter" || keyEvent.key === " ") {
                const card = (e.target as HTMLElement).closest(".setting-card");
                if (card) {
                    keyEvent.preventDefault();
                    const type = card.getAttribute("data-setting-type");
                    if (type) {
                        this.openModal(type);
                    }
                }
            }
        });

        const modal = this.querySelector("#settingModal");
        const btnClose = this.querySelector("#btnCloseModal");

        btnClose?.addEventListener("click", () => {
            this.closeModal();
        });

        modal?.addEventListener("click", (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        const modalBody = this.querySelector("#modalBody");
        modalBody?.addEventListener("click", (e) => {
            const btn = (e.target as HTMLElement).closest(".option-btn");
            if (btn) {
                const settingType = btn.getAttribute("data-type");
                const val = btn.getAttribute("data-value");
                if (settingType && val) {
                    this.applySettingChange(settingType, val);
                    this.closeModal();
                }
            }
        });
    }

    private openModal(type: string) {
        const modal = this.querySelector("#settingModal");
        const modalTitle = this.querySelector("#modalTitle");
        const modalBody = this.querySelector("#modalBody");

        if (!modal || !modalTitle || !modalBody) return;

        let titleText = "";
        let bodyHtml = "";

        switch (type) {
            case "region":
                titleText = "검색 지역 선택";
                bodyHtml = `
                    <div class="option-grid">
                        ${REGIONS.map((r) => `
                            <button type="button" class="option-btn ${r === this.region ? "selected" : ""}" data-type="region" data-value="${r}">
                                <span>${r}</span>
                                ${r === this.region ? `
                                    <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                ` : ""}
                            </button>
                        `).join("")}
                    </div>
                `;
                break;

            case "radius":
                titleText = "검색 범위 선택";
                bodyHtml = `
                    <div class="option-list">
                        ${RADIUS_OPTIONS.map((rad) => `
                            <button type="button" class="option-btn ${rad === this.radius ? "selected" : ""}" data-type="radius" data-value="${rad}">
                                <span>${rad}</span>
                                ${rad === this.radius ? `
                                    <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                ` : ""}
                            </button>
                        `).join("")}
                    </div>
                `;
                break;

            case "sort":
                titleText = "검색 결과 정렬";
                bodyHtml = `
                    <div class="option-list">
                        ${SORT_OPTIONS.map((s) => `
                            <button type="button" class="option-btn ${s === this.sort ? "selected" : ""}" data-type="sort" data-value="${s}">
                                <span>${s}</span>
                                ${s === this.sort ? `
                                    <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                ` : ""}
                            </button>
                        `).join("")}
                    </div>
                `;
                break;

            case "notification":
                titleText = "알림 설정";
                bodyHtml = `
                    <div class="option-list">
                        ${NOTIFICATION_OPTIONS.map((n) => `
                            <button type="button" class="option-btn ${n === this.notification ? "selected" : ""}" data-type="notification" data-value="${n}">
                                <span>${n}</span>
                                ${n === this.notification ? `
                                    <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                ` : ""}
                            </button>
                        `).join("")}
                    </div>
                `;
                break;

            case "info":
                titleText = "앱 정보";
                bodyHtml = `
                    <div class="info-content">
                        <div class="info-item">
                            <h4>Book World — 책 어디서 빌리지?</h4>
                            <p>버전: 1.0.0 (최신 버전)</p>
                        </div>
                        <div class="info-item">
                            <h4>데이터 제공처</h4>
                            <p>국립중앙도서관 도서관 정보나루 API, 카카오 책 검색 API, 교보문고</p>
                        </div>
                        <div class="info-item">
                            <h4>서비스 소개</h4>
                            <p>가까운 지역 도서관의 책 소장 상태와 대출 여부를 빠르게 검색해 드립니다.</p>
                        </div>
                    </div>
                `;
                break;
        }

        modalTitle.textContent = titleText;
        modalBody.innerHTML = bodyHtml;
        modal.classList.add("open");
    }

    private closeModal() {
        const modal = this.querySelector("#settingModal");
        modal?.classList.remove("open");
    }

    private applySettingChange(type: string, value: string) {
        switch (type) {
            case "region": {
                this.region = value;
                this.saveSetting(STORAGE_KEYS.REGION, value);
                const regionSub = this.querySelector("#regionSubText");
                if (regionSub) regionSub.textContent = value;
                showToast(`검색 지역이 '${value}'(으)로 변경되었습니다.`);
                break;
            }

            case "radius": {
                this.radius = value;
                this.saveSetting(STORAGE_KEYS.RADIUS, value);
                const radiusSub = this.querySelector("#radiusSubText");
                if (radiusSub) radiusSub.textContent = value;
                showToast(`검색 범위가 '${value}'(으)로 변경되었습니다.`);
                break;
            }

            case "sort": {
                this.sort = value;
                this.saveSetting(STORAGE_KEYS.SORT, value);
                const sortSub = this.querySelector("#sortSubText");
                if (sortSub) sortSub.textContent = value;
                showToast(`정렬 기준이 '${value}'(으)로 변경되었습니다.`);
                break;
            }

            case "notification": {
                this.notification = value;
                this.saveSetting(STORAGE_KEYS.NOTIFICATION, value);
                const notiSub = this.querySelector("#notificationSubText");
                if (notiSub) notiSub.textContent = value;
                showToast(`알림 설정이 변경되었습니다.`);
                break;
            }
        }
    }
}
