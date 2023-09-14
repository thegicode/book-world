import { state } from "../../modules/model";
import { CustomEventEmitter } from "../../utils";

export default class FavoriteNav extends HTMLElement {
    nav: HTMLElement | null;
    overlayCategory: HTMLElement;
    locationCategory: string | null;

    constructor() {
        super();

        this.nav = this.querySelector(".favorite-category");

        this.overlayCategory = document.querySelector(
            "overlay-category"
        ) as HTMLElement;

        const params = new URLSearchParams(location.search);
        this.locationCategory = params.get("category");

        this.onCategoryAdded = this.onCategoryAdded.bind(this);
        this.onCategoryRenamed = this.onCategoryRenamed.bind(this);
        this.onCategoryDeleted = this.onCategoryDeleted.bind(this);
    }

    connectedCallback() {
        this.render();
        this.overlayCatalog();

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

    onCategoryAdded(event: ICustomEvent<{ category: string }>) {
        const { category } = event.detail;
        const index = Object.keys(state.category).length - 1;

        const element = this.createItem(category, index);
        this.nav?.appendChild(element);
    }

    onCategoryRenamed(event: ICustomEvent<{ value: string }>) {
        if (!this.nav) return;
        const { value } = event.detail;
        const index = Object.keys(state.category).indexOf(value);
        this.nav.querySelectorAll("a")[index].textContent = value;
    }

    onCategoryDeleted(event: ICustomEvent<{ index: number }>) {
        const { index } = event.detail;
        this.nav?.querySelectorAll("a")[index].remove();
    }

    public render() {
        if (!this.nav) return;
        this.nav.innerHTML = "";

        const fragment = new DocumentFragment();
        Object.keys(state.category).forEach(
            (category: string, index: number) => {
                const el = this.createItem(category, index);
                fragment.appendChild(el);
            }
        );

        this.nav.appendChild(fragment);

        this.hidden = false;
    }

    private createItem(category: string, index: number) {
        const el = document.createElement("a") as HTMLAnchorElement;
        el.textContent = category;
        el.href = this.getUrl(category);

        if (category === this.locationCategory) {
            el.dataset.active = "true";
        }

        el.addEventListener("click", (event) => {
            this.onChange(category, index, el, event);
        });

        return el;
    }

    private onChange(category: string, el: HTMLElement, event: Event) {
        event.preventDefault();

        el.dataset.active = "true";

        location.search = this.getUrl(category);
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
}
