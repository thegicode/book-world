import { html, render, TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { repeat } from "lit/directives/repeat.js";
import bookModel, { BookModelEvent } from "@/model";

interface ReactiveController {
    hostConnected(): void;
    hostDisconnected(): void;
}

interface ReactiveControllerHost extends HTMLElement {
    addController(controller: ReactiveController): void;
    requestUpdate(): void;
}

export default class BookWhereFavoriteNav
    extends HTMLElement
    implements ReactiveControllerHost
{
    static get observedAttributes() {
        return ["selected-category"];
    }

    private controllers = new Set<ReactiveController>();
    private isUpdatePending = false;
    private renderTarget: HTMLElement = this;
    private lastRenderedState = "";

    constructor() {
        super();
        this.addController(new FavoriteNavModelController(this));
    }

    public addController(controller: ReactiveController) {
        this.controllers.add(controller);
        if (this.isConnected) {
            controller.hostConnected();
        }
    }

    public requestUpdate() {
        if (this.isUpdatePending) return;
        this.isUpdatePending = true;

        requestAnimationFrame(() => {
            if (!this.isConnected) {
                this.isUpdatePending = false;
                return;
            }
            this.performUpdate();
            this.isUpdatePending = false;
        });
    }

    connectedCallback() {
        this.renderTarget = this;
        this.addEventListener("keydown", this.handleKeydown);
        this.controllers.forEach((c) => c.hostConnected());
        this.requestUpdate();
    }

    disconnectedCallback() {
        this.removeEventListener("keydown", this.handleKeydown);
        this.controllers.forEach((c) => c.hostDisconnected());
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === "selected-category" && oldValue !== newValue) {
            this.requestUpdate();
        }
    }

    private performUpdate() {
        let categories = this.getCategories();
        
        if (categories.length === 0) {
            categories = ["전체", "빌리고 싶은 책", "빌린 책"];
        }

        const activeCategory = this.resolveActiveCategory(categories);

        if (activeCategory && this.getAttribute("selected-category") !== activeCategory) {
             this.setAttribute("selected-category", activeCategory);
        } else if (!activeCategory && this.hasAttribute("selected-category")) {
            this.removeAttribute("selected-category");
        }

        const totalCount = this.getTotalCount();
        const stateKey = `${categories.join(",")}|${activeCategory}|${totalCount}`;
        if (this.lastRenderedState === stateKey) return;
        this.lastRenderedState = stateKey;

        this.render(categories, activeCategory);
    }

    private render(categories: string[], activeCategory: string | null) {
        const template = html`
            <div class="favorite-category-wrapper">
                <nav
                    class="favorite-category"
                    role="tablist"
                    aria-label="도서 카테고리"
                >
                    ${repeat(
                        categories,
                        (category) => category,
                        (category) => this.renderTab(category, activeCategory)
                    )}
                </nav>
            </div>
        `;

        render(template, this.renderTarget);
    }

    private renderTab(category: string, activeCategory: string | null): TemplateResult {
        const isActive = category === activeCategory;
        const count = this.getCategoryCount(category);

        return html`
            <a
                href="?category=${encodeURIComponent(category)}"
                class="${classMap({ "category-item": true, active: isActive })}"
                role="tab"
                aria-selected="${isActive}"
                tabindex="${isActive ? "0" : "-1"}"
                data-category="${category}"
            >
                <span>${category}</span>
                <span class="count-badge">${count}</span>
            </a>
        `;
    }

    private getCategories(): string[] {
        const order = bookModel.favoriteCategoryOrder;
        if (order.length === 0) {
            return ["전체", "빌리고 싶은 책", "빌린 책"];
        }
        return order;
    }

    private getCategoryCount(category: string): number {
        const favorites = bookModel.favorites;
        if (category === "전체") {
            const allIsbns = new Set<string>();
            Object.values(favorites).forEach((list) => {
                list.forEach((isbn) => allIsbns.add(isbn));
            });
            return allIsbns.size;
        }
        return favorites[category]?.length || 0;
    }

    private getTotalCount(): number {
        return this.getCategoryCount("전체");
    }

    private resolveActiveCategory(categories: string[]): string | null {
        if (categories.length === 0) return null;

        const selected = this.getAttribute("selected-category");
        if (selected && categories.includes(selected)) {
            return selected;
        }

        const queryCategory = new URLSearchParams(location.search).get("category");
        if (queryCategory && categories.includes(queryCategory)) {
            return queryCategory;
        }

        return categories[0];
    }

    private handleKeydown = (event: KeyboardEvent) => {
        const tabs = Array.from(this.querySelectorAll('[role="tab"]')) as HTMLElement[];
        if (tabs.length === 0) return;

        const currentTab = document.activeElement as HTMLElement;
        const currentIndex = tabs.indexOf(currentTab);
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
}

class FavoriteNavModelController implements ReactiveController {
    private publishers;

    constructor(private host: ReactiveControllerHost) {
        this.publishers = [
            bookModel.getPublisher(BookModelEvent.FavoriteCategoriesUpdate),
            bookModel.getPublisher(BookModelEvent.FavoriteBookUpdate),
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
