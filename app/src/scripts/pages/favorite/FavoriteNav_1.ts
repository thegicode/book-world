import { html, render, TemplateResult } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { classMap } from "lit/directives/class-map.js";
import bookModel, { BookModelEvent } from "@/model";

// 프라이빗 상태 관리를 위한 심볼 및 WeakMap
const _rafId = Symbol("rafId");
const _lastData = Symbol("lastData");

/**
 * FavoriteNav Component (Transcendent Version)
 * - Intelligent Rendering Cancellation
 * - Keyboard Arrow Key Navigation (A11y)
 * - Deep State Comparison for Performance
 */
export default class FavoriteNav extends HTMLElement {
    [_rafId]: number | null = null;
    [_lastData] = "";

    static get observedAttributes() {
        return ["selected-category"];
    }

    constructor() {
        super();
        new ModelController(this);
    }

    private get _activeCategory(): string | null {
        return (
            this.getAttribute("selected-category") ||
            new URLSearchParams(location.search).get("category") ||
            bookModel.favoriteCategoryOrder[0] ||
            null
        );
    }

    connectedCallback() {
        this.addEventListener("keydown", this._handleKeydown);
        this.dispatchEvent(new CustomEvent("connected"));
        this.requestUpdate();
    }

    disconnectedCallback() {
        const rafId = this[_rafId];
        if (rafId !== null) cancelAnimationFrame(rafId);
        this.removeEventListener("keydown", this._handleKeydown);
        this.dispatchEvent(new CustomEvent("disconnected"));
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === "selected-category" && oldValue !== newValue) {
            this.requestUpdate();
        }
    }

    /**
     * 스마트 업데이트 요청 (데이터 변경 감지 포함)
     */
    public requestUpdate() {
        const currentData =
            JSON.stringify(bookModel.favoriteCategoryOrder) +
            this._activeCategory;
        if (this[_lastData] === currentData) return; // 데이터 변화 없으면 무시
        this[_lastData] = currentData;

        if (this[_rafId]) cancelAnimationFrame(this[_rafId]);

        this[_rafId] = window.requestAnimationFrame(() => {
            this[_rafId] = null;
            this._performUpdate();
        });
    }

    private _performUpdate() {
        const isDev = process.env.NODE_ENV === "development";
        if (isDev) console.time("FavoriteNav: Render");

        try {
            const current = this._activeCategory;
            if (current && this.getAttribute("selected-category") !== current) {
                this.setAttribute("selected-category", current);
            }
            this.render();
            this._updated();
        } catch (error) {
            console.error("FavoriteNav error:", error);
        } finally {
            if (isDev) console.timeEnd("FavoriteNav: Render");
        }
    }

    private _updated() {
        // 사후 처리 로직
    }

    /**
     * 키보드 방향키 내비게이션 (Accessibility UX)
     */
    private _handleKeydown = (e: KeyboardEvent) => {
        const tabs = Array.from(
            this.querySelectorAll('a[role="tab"]'),
        ) as HTMLElement[];
        const currentIndex = tabs.indexOf(
            document.activeElement as HTMLElement,
        );
        if (currentIndex === -1) return;

        let nextIndex: number | null = null;
        if (e.key === "ArrowRight")
            nextIndex = (currentIndex + 1) % tabs.length;
        if (e.key === "ArrowLeft")
            nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;

        if (nextIndex !== null) {
            e.preventDefault();
            tabs[nextIndex].focus();
            tabs[nextIndex].click(); // 선택까지 시뮬레이션
        }
    };

    private _handleEditClick = (e: Event) => {
        e.preventDefault();
        this.dispatchEvent(
            new CustomEvent("edit-categories", {
                bubbles: true,
                composed: true,
                detail: { source: "FavoriteNav" },
            }),
        );

        const overlay = document.querySelector(
            "overlay-category",
        ) as HTMLElement;
        if (overlay) overlay.hidden = !overlay.hidden;
    };

    private _renderTab(cat: string, active: string | null): TemplateResult {
        const isActive = cat === active;
        return html`
            <a
                href="?category=${encodeURIComponent(cat)}"
                class="${classMap({ "category-item": true, active: isActive })}"
                aria-selected="${isActive}"
                role="tab"
                tabindex="${isActive ? "0" : "-1"}"
            >
                ${cat}
            </a>
        `;
    }

    protected render() {
        const categories = Object.freeze([...bookModel.favoriteCategoryOrder]);
        const selected = this._activeCategory;

        this.toggleAttribute("hidden", categories.length === 0);
        if (categories.length === 0) return;

        const template = html`
            <nav
                class="favorite-category"
                role="tablist"
                aria-label="도서 카테고리"
            >
                ${repeat(
                    categories,
                    (cat) => cat,
                    (cat) => this._renderTab(cat, selected),
                )}
            </nav>
            <button
                type="button"
                class="favorite-changeButton"
                aria-label="카테고리 편집"
                @click=${this._handleEditClick}
            >
                편집
            </button>
        `;

        render(template, this);
    }
}

class ModelController {
    constructor(private host: FavoriteNav) {
        const update = () => this.host.requestUpdate();
        this.host.addEventListener("connected", () => {
            bookModel.subscribe(
                BookModelEvent.FavoriteCategoriesUpdate,
                update,
            );
            bookModel.subscribe(BookModelEvent.BookStateUpdate, update);
            window.addEventListener("popstate", update);
        });
        this.host.addEventListener("disconnected", () => {
            bookModel.unsubscribe(
                BookModelEvent.FavoriteCategoriesUpdate,
                update,
            );
            bookModel.unsubscribe(BookModelEvent.BookStateUpdate, update);
            window.removeEventListener("popstate", update);
        });
    }
}
