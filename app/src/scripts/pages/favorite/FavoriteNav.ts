import { html, render, TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { repeat } from "lit/directives/repeat.js";
import bookModel, { BookModelEvent } from "@/model";

/**
 * Interface for Reactive Controllers
 * Allows external logic to hook into the component's lifecycle.
 */
interface ReactiveController {
    hostConnected(): void;
    hostDisconnected(): void;
}

/**
 * Interface for the Host Component
 * Defines the contract that the host must fulfill for controllers.
 */
interface ReactiveControllerHost extends HTMLElement {
    addController(controller: ReactiveController): void;
    requestUpdate(): void;
}

/**
 * FavoriteNav Component
 *
 * A high-performance, accessible navigation component for favorite categories.
 *
 * Key Features:
 * - **Reactive Architecture**: Uses a Controller pattern to decouple model logic.
 * - **Efficient Rendering**: Batched updates via requestAnimationFrame and smart diffing (lit-html).
 * - **Accessibility**: Full keyboard support (Arrow keys, Home, End) and ARIA attributes.
 * - **Clean Code**: Strict typing and separation of concerns.
 */
export default class FavoriteNav
    extends HTMLElement
    implements ReactiveControllerHost
{
    static get observedAttributes() {
        return ["selected-category"];
    }

    private controllers = new Set<ReactiveController>();
    private isUpdatePending = false;
    private renderTarget: HTMLElement = this;
    
    // State cache to avoid redundant renders
    private lastRenderedState = "";

    constructor() {
        super();
        // Register the model controller to handle data subscriptions
        this.addController(new FavoriteNavModelController(this));
    }

    // --- ReactiveControllerHost Implementation ---

    public addController(controller: ReactiveController) {
        this.controllers.add(controller);
        if (this.isConnected) {
            controller.hostConnected();
        }
    }

    public requestUpdate() {
        if (this.isUpdatePending) return;
        this.isUpdatePending = true;

        // Batch updates to the next animation frame for performance
        requestAnimationFrame(() => {
            if (!this.isConnected) {
                this.isUpdatePending = false;
                return;
            }
            this.performUpdate();
            this.isUpdatePending = false;
        });
    }

    // --- Lifecycle Methods ---

    connectedCallback() {
        this.renderTarget = this;
        this.addEventListener("keydown", this.handleKeydown);
        this.addEventListener("click", this.handleClick);

        // Notify controllers that the host is connected
        this.controllers.forEach((c) => c.hostConnected());
        
        // Initial render
        this.requestUpdate();
    }

    disconnectedCallback() {
        this.removeEventListener("keydown", this.handleKeydown);
        this.removeEventListener("click", this.handleClick);

        // Notify controllers that the host is disconnected
        this.controllers.forEach((c) => c.hostDisconnected());
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === "selected-category" && oldValue !== newValue) {
            this.requestUpdate();
        }
    }

    // --- Update & Render Logic ---

    private performUpdate() {
        const categories = this.getCategories();
        const activeCategory = this.resolveActiveCategory(categories);

        // Sync attribute if needed (single source of truth reflection)
        if (activeCategory && this.getAttribute("selected-category") !== activeCategory) {
             this.setAttribute("selected-category", activeCategory);
        } else if (!activeCategory && this.hasAttribute("selected-category")) {
            this.removeAttribute("selected-category");
        }

        // Optimization: Check if semantic state has changed before asking lit-html to diff
        const stateKey = `${categories.join(",")}|${activeCategory}`;
        if (this.lastRenderedState === stateKey) return;
        this.lastRenderedState = stateKey;

        this.render(categories, activeCategory);
    }

    private render(categories: string[], activeCategory: string | null) {
        this.hidden = categories.length === 0;
        if (categories.length === 0) return;

        const template = html`
            <nav
                class="favorite-category"
                role="tablist"
                aria-label="도서 카테고리"
            >
                ${repeat(
                    categories,
                    (category) => category, // Key function for efficient list reconciliation
                    (category) => this.renderTab(category, activeCategory)
                )}
            </nav>
            <button
                type="button"
                class="favorite-changeButton"
                aria-haspopup="dialog"
                aria-label="카테고리 편집"
            >
                카테고리 편집
            </button>
        `;

        render(template, this.renderTarget);
    }

    private renderTab(category: string, activeCategory: string | null): TemplateResult {
        const isActive = category === activeCategory;
        return html`
            <a
                href="?category=${encodeURIComponent(category)}"
                class="${classMap({ "category-item": true, active: isActive })}"
                role="tab"
                aria-selected="${isActive}"
                tabindex="${isActive ? "0" : "-1"}"
                data-category="${category}"
            >
                ${category}
            </a>
        `;
    }

    // --- Data Helpers ---

    private getCategories(): string[] {
        return bookModel.favoriteCategoryOrder;
    }

    private resolveActiveCategory(categories: string[]): string | null {
        if (categories.length === 0) return null;

        // 1. Check attribute (highest priority if set programmatically)
        const selected = this.getAttribute("selected-category");
        if (selected && categories.includes(selected)) {
            return selected;
        }

        // 2. Check URL Query
        const queryCategory = new URLSearchParams(location.search).get("category");
        if (queryCategory && categories.includes(queryCategory)) {
            return queryCategory;
        }

        // 3. Fallback to first category
        return categories[0];
    }

    // --- Event Handlers ---

    private handleClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        // Handle "Edit Categories" button
        if (target.closest(".favorite-changeButton")) {
            event.preventDefault();
            this.dispatchEditEvent();
            return;
        }
    };

    private handleKeydown = (event: KeyboardEvent) => {
        const tabs = Array.from(this.querySelectorAll('[role="tab"]')) as HTMLElement[];
        if (tabs.length === 0) return;

        const currentTab = document.activeElement as HTMLElement;
        const currentIndex = tabs.indexOf(currentTab);
        
        // Only handle navigation if focus is on a tab
        if (currentIndex === -1) return;

        let nextIndex: number | null = null;

        switch (event.key) {
            case "ArrowRight":
                nextIndex = (currentIndex + 1) % tabs.length;
                break;
            case "ArrowLeft":
                nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                break;
            case "Home":
                nextIndex = 0;
                break;
            case "End":
                nextIndex = tabs.length - 1;
                break;
            case "Enter":
            case " ":
                event.preventDefault();
                currentTab.click();
                return;
        }

        if (nextIndex !== null) {
            event.preventDefault();
            const nextTab = tabs[nextIndex];
            nextTab.focus();
        }
    };

    private dispatchEditEvent() {
        this.dispatchEvent(
            new CustomEvent("edit-categories", {
                bubbles: true,
                composed: true,
                detail: { source: "FavoriteNav" },
            })
        );
    }
}

/**
 * Controller to bridge BookModel and FavoriteNav
 */
class FavoriteNavModelController implements ReactiveController {
    private publishers;

    constructor(private host: ReactiveControllerHost) {
        this.publishers = [
            bookModel.getPublisher(BookModelEvent.FavoriteCategoriesUpdate),
            bookModel.getPublisher(BookModelEvent.BookStateUpdate),
        ];
    }

    hostConnected() {
        this.publishers.forEach((p) => p.subscribe(this.update));
        window.addEventListener("popstate", this.update);
    }

    hostDisconnected() {
        this.publishers.forEach((p) => p.unsubscribe(this.update));
        window.removeEventListener("popstate", this.update);
    }

    private update = () => {
        this.host.requestUpdate();
    };
}
