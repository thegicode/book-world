import { state } from "../../modules/model";

export default class FavoriteNav extends HTMLElement {
    nav: HTMLElement | null;
    overlayCategory: HTMLElement;
    locationCategoryIndex: number | null;

    constructor() {
        super();

        this.nav = this.querySelector(".favorite-category");

        this.overlayCategory = document.querySelector(
            "overlay-category"
        ) as HTMLElement;

        const params = new URLSearchParams(location.search);
        this.locationCategoryIndex = Number(params.get("category"));
    }

    connectedCallback() {
        if (this.locationCategoryIndex === null) return;
        this.render();
        this.overlayCatalog();
    }

    private render() {
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
        el.href = `?category=${index}`;

        if (index === this.locationCategoryIndex) {
            el.dataset.active = "true";
        }

        el.addEventListener("click", (event) => {
            this.onChange(index, el, event);
        });

        return el;
    }

    private onChange(index: number, el: HTMLElement, event: Event) {
        event.preventDefault();

        el.dataset.active = "true";

        location.search = `category=${index}`;
    }

    private overlayCatalog() {
        const modal = this.overlayCategory;
        const changeButton = this.querySelector(".favorite-changeButton");
        changeButton?.addEventListener("click", () => {
            modal.hidden = Boolean(!modal.hidden);
        });
    }
}
