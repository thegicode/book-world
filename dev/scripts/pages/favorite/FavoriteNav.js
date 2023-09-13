import { state } from "../../modules/model";
export default class FavoriteNav extends HTMLElement {
    constructor() {
        super();
        this.nav = this.querySelector(".favorite-category");
        this.overlayCategory = document.querySelector("overlay-category");
        const params = new URLSearchParams(location.search);
        this.locationCategoryIndex = Number(params.get("category"));
    }
    connectedCallback() {
        if (this.locationCategoryIndex === null)
            return;
        this.render();
        this.overlayCatalog();
    }
    render() {
        if (!this.nav)
            return;
        this.nav.innerHTML = "";
        const fragment = new DocumentFragment();
        Object.keys(state.category).forEach((category, index) => {
            const el = this.createItem(category, index);
            fragment.appendChild(el);
        });
        this.nav.appendChild(fragment);
        this.hidden = false;
    }
    createItem(category, index) {
        const el = document.createElement("a");
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
    onChange(index, el, event) {
        event.preventDefault();
        el.dataset.active = "true";
        location.search = `category=${index}`;
    }
    overlayCatalog() {
        const modal = this.overlayCategory;
        const changeButton = this.querySelector(".favorite-changeButton");
        changeButton === null || changeButton === void 0 ? void 0 : changeButton.addEventListener("click", () => {
            modal.hidden = Boolean(!modal.hidden);
        });
    }
}
//# sourceMappingURL=FavoriteNav.js.map