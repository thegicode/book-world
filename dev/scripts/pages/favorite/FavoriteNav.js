import { state } from "../../modules/model";
import { CustomEventEmitter } from "../../utils";
export default class FavoriteNav extends HTMLElement {
    constructor() {
        super();
        this.nav = this.querySelector(".favorite-category");
        this.overlayCategory = document.querySelector("overlay-category");
        const params = new URLSearchParams(location.search);
        this.locationCategory = params.get("category");
        this.onCategoryAdded = this.onCategoryAdded.bind(this);
        this.onCategoryRenamed = this.onCategoryRenamed.bind(this);
        this.onCategoryDeleted = this.onCategoryDeleted.bind(this);
    }
    connectedCallback() {
        this.render();
        this.overlayCatalog();
        CustomEventEmitter.add("categoryAdded", this.onCategoryAdded);
        CustomEventEmitter.add("categoryRenamed", this.onCategoryRenamed);
        CustomEventEmitter.add("categoryDeleted", this.onCategoryDeleted);
    }
    disconnectedCallback() {
        CustomEventEmitter.remove("categoryAdded", this.onCategoryAdded);
        CustomEventEmitter.remove("categoryRenamed", this.onCategoryRenamed);
        CustomEventEmitter.remove("categoryDeleted", this.onCategoryDeleted);
    }
    onCategoryAdded(event) {
        var _a;
        const { category } = event.detail;
        const index = Object.keys(state.category).length - 1;
        const element = this.createItem(category, index);
        (_a = this.nav) === null || _a === void 0 ? void 0 : _a.appendChild(element);
    }
    onCategoryRenamed(event) {
        if (!this.nav)
            return;
        const { value } = event.detail;
        const index = Object.keys(state.category).indexOf(value);
        this.nav.querySelectorAll("a")[index].textContent = value;
    }
    onCategoryDeleted(event) {
        var _a;
        const { index } = event.detail;
        (_a = this.nav) === null || _a === void 0 ? void 0 : _a.querySelectorAll("a")[index].remove();
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
        el.href = this.getUrl(category);
        if (category === this.locationCategory) {
            el.dataset.active = "true";
        }
        el.addEventListener("click", (event) => {
            this.onChange(category, index, el, event);
        });
        return el;
    }
    onChange(category, el, event) {
        event.preventDefault();
        el.dataset.active = "true";
        location.search = this.getUrl(category);
    }
    getUrl(category) {
        const categoryStr = encodeURIComponent(category);
        return `category=${categoryStr}`;
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