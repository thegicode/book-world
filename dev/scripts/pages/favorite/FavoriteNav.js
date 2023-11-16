import store from "../../modules/store";
import { CustomEventEmitter } from "../../utils";
export default class FavoriteNav extends HTMLElement {
    constructor() {
        super();
        this.nav = this.querySelector(".favorite-category");
        this.overlayCategory = document.querySelector("overlay-category");
        const params = new URLSearchParams(location.search);
        this.category = params.get("category");
        this.onCategoryAdded = this.onCategoryAdded.bind(this);
        this.onCategoryRenamed = this.onCategoryRenamed.bind(this);
        this.onCategoryDeleted = this.onCategoryDeleted.bind(this);
        this.onCategoryChanged = this.onCategoryChanged.bind(this);
    }
    connectedCallback() {
        CustomEventEmitter.add("categoryAdded", this.onCategoryAdded);
        CustomEventEmitter.add("categoryRenamed", this.onCategoryRenamed);
        CustomEventEmitter.add("categoryDeleted", this.onCategoryDeleted);
        CustomEventEmitter.add("categoryChanged", this.onCategoryChanged);
        if (this.category === null) {
            this.category = store.categorySort[0];
            const url = this.getUrl(this.category);
            location.search = url;
        }
        this.render();
        this.overlayCatalog();
    }
    disconnectedCallback() {
        CustomEventEmitter.remove("categoryAdded", this.onCategoryAdded);
        CustomEventEmitter.remove("categoryRenamed", this.onCategoryRenamed);
        CustomEventEmitter.remove("categoryDeleted", this.onCategoryDeleted);
    }
    render() {
        if (!this.nav)
            return;
        this.nav.innerHTML = "";
        const fragment = new DocumentFragment();
        store.categorySort.forEach((category) => {
            const el = this.createItem(category);
            fragment.appendChild(el);
        });
        this.nav.appendChild(fragment);
        this.hidden = false;
    }
    createItem(category) {
        const el = document.createElement("a");
        el.textContent = category;
        el.href = `?${this.getUrl(category)}`;
        if (category === this.category) {
            el.ariaSelected = "true";
        }
        el.addEventListener("click", (event) => {
            this.onChange(category, el, event);
        });
        return el;
    }
    onChange(category, el, event) {
        event.preventDefault();
        el.ariaSelected = "true";
        location.search = this.getUrl(category);
        this.category = category;
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
    onCategoryAdded(event) {
        var _a;
        const { category } = event.detail;
        const element = this.createItem(category);
        (_a = this.nav) === null || _a === void 0 ? void 0 : _a.appendChild(element);
    }
    onCategoryRenamed(event) {
        if (!this.nav)
            return;
        const { category, value } = event.detail;
        const index = store.categorySort.indexOf(value);
        this.nav.querySelectorAll("a")[index].textContent = value;
        if (this.category === category) {
            location.search = this.getUrl(value);
        }
    }
    onCategoryDeleted(event) {
        var _a;
        const { index } = event.detail;
        (_a = this.nav) === null || _a === void 0 ? void 0 : _a.querySelectorAll("a")[index].remove();
    }
    onCategoryChanged(event) {
        var _a;
        const { draggedKey, targetKey } = event.detail;
        const draggedIndex = store.categorySort.indexOf(draggedKey);
        const targetIndex = store.categorySort.indexOf(targetKey);
        const navLinks = (_a = this.nav) === null || _a === void 0 ? void 0 : _a.querySelectorAll("a");
        if (navLinks) {
            const targetEl = navLinks[targetIndex].cloneNode(true);
            const draggedEl = navLinks[draggedIndex].cloneNode(true);
            navLinks[draggedIndex].replaceWith(targetEl);
            navLinks[targetIndex].replaceWith(draggedEl);
        }
    }
}
//# sourceMappingURL=FavoriteNav.js.map