import { state } from "../../modules/model";
import { CustomEventEmitter } from "../../utils";

export default class FavoriteNav extends HTMLElement {
    nav: HTMLElement | null;
    overlayCategory: HTMLElement;
    category: string | null;

    constructor() {
        super();

        this.nav = this.querySelector(".favorite-category");

        this.overlayCategory = document.querySelector(
            "overlay-category"
        ) as HTMLElement;

        const params = new URLSearchParams(location.search);
        this.category = params.get("category");

        this.onCategoryAdded = this.onCategoryAdded.bind(this);
        this.onCategoryRenamed = this.onCategoryRenamed.bind(this);
        this.onCategoryDeleted = this.onCategoryDeleted.bind(this);
        this.onCategoryChanged = this.onCategoryChanged.bind(this);
    }

    connectedCallback() {
        CustomEventEmitter.add(
            "categoryAdded",
            this.onCategoryAdded as EventListener
        );

        CustomEventEmitter.add(
            "categoryRenamed",
            this.onCategoryRenamed as EventListener
        );

        CustomEventEmitter.add(
            "categoryDeleted",
            this.onCategoryDeleted as EventListener
        );

        CustomEventEmitter.add(
            "categoryChanged",
            this.onCategoryChanged as EventListener
        );

        if (this.category === null) {
            this.category = state.categorySort[0];
            const url = this.getUrl(this.category);
            location.search = url;
        }

        this.render();
        this.overlayCatalog();
    }

    disconnectedCallback() {
        CustomEventEmitter.remove(
            "categoryAdded",
            this.onCategoryAdded as EventListener
        );

        CustomEventEmitter.remove(
            "categoryRenamed",
            this.onCategoryRenamed as EventListener
        );

        CustomEventEmitter.remove(
            "categoryDeleted",
            this.onCategoryDeleted as EventListener
        );
    }

    private render() {
        if (!this.nav) return;
        this.nav.innerHTML = "";

        const fragment = new DocumentFragment();
        state.categorySort.forEach((category: string) => {
            const el = this.createItem(category);
            fragment.appendChild(el);
        });

        this.nav.appendChild(fragment);

        this.hidden = false;
    }

    private createItem(category: string) {
        const el = document.createElement("a") as HTMLAnchorElement;
        el.textContent = category;
        el.href = `?${this.getUrl(category)}`;

        if (category === this.category) {
            el.dataset.active = "true";
        }

        el.addEventListener("click", (event) => {
            this.onChange(category, el, event);
        });

        return el;
    }

    private onChange(category: string, el: HTMLElement, event: Event) {
        event.preventDefault();

        el.dataset.active = "true";

        location.search = this.getUrl(category);
        this.category = category;
    }

    private getUrl(category: string) {
        const categoryStr = encodeURIComponent(category);
        return `category=${categoryStr}`;
    }

    private overlayCatalog() {
        const modal = this.overlayCategory;
        const changeButton = this.querySelector(".favorite-changeButton");
        changeButton?.addEventListener("click", () => {
            modal.hidden = Boolean(!modal.hidden);
        });
    }

    private onCategoryAdded(event: ICustomEvent<{ category: string }>) {
        const { category } = event.detail;

        const element = this.createItem(category);
        this.nav?.appendChild(element);
    }

    private onCategoryRenamed(
        event: ICustomEvent<{ category: string; value: string }>
    ) {
        if (!this.nav) return;
        const { category, value } = event.detail;
        const index = state.categorySort.indexOf(value);
        this.nav.querySelectorAll("a")[index].textContent = value;

        if (this.category === category) {
            location.search = this.getUrl(value);
        }
    }

    private onCategoryDeleted(event: ICustomEvent<{ index: number }>) {
        const { index } = event.detail;
        this.nav?.querySelectorAll("a")[index].remove();
    }

    private onCategoryChanged(
        event: ICustomEvent<{ draggedKey: string; targetKey: string }>
    ) {
        const { draggedKey, targetKey } = event.detail;

        const draggedIndex = state.categorySort.indexOf(draggedKey);
        const targetIndex = state.categorySort.indexOf(targetKey);

        const navLinks = this.nav?.querySelectorAll("a");
        if (navLinks) {
            const targetEl = navLinks[targetIndex].cloneNode(true);
            const draggedEl = navLinks[draggedIndex].cloneNode(true);

            navLinks[draggedIndex].replaceWith(targetEl);
            navLinks[targetIndex].replaceWith(draggedEl);
        }
    }
}
