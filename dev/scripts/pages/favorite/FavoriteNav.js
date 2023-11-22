import bookStore2 from "../../modules/BookStore2";
export default class FavoriteNav extends HTMLElement {
    constructor() {
        super();
        this.nav = this.querySelector(".favorite-category");
        this.overlayCategory = document.querySelector("overlay-category");
        const params = new URLSearchParams(location.search);
        this.category = params.get("category");
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
    }
    connectedCallback() {
        if (this.category === null) {
            this.category = bookStore2.getCategorySort()[0];
            const url = this.getUrl(this.category);
            location.search = url;
        }
        this.render();
        this.overlayCatalog();
        bookStore2.subscribeToCategoryUpdate(this
            .handleCategoryChange);
    }
    disconnectedCallback() {
        bookStore2.unsubscribeToCategoryUpdate(this
            .handleCategoryChange);
    }
    render() {
        if (!this.nav)
            return;
        this.nav.innerHTML = "";
        const fragment = new DocumentFragment();
        bookStore2.getCategorySort().forEach((category) => {
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
    handleCategoryChange({ type, payload }) {
        var _a, _b, _c;
        switch (type) {
            case "add":
                {
                    const element = this.createItem(payload.name);
                    (_a = this.nav) === null || _a === void 0 ? void 0 : _a.appendChild(element);
                }
                break;
            case "rename":
                {
                    if (!this.nav)
                        return;
                    const prevName = payload.prevName;
                    const newName = payload.newName;
                    const index = bookStore2
                        .getCategorySort()
                        .indexOf(prevName);
                    this.nav.querySelectorAll("a")[index].textContent = newName;
                    bookStore2.renameCategorySort(prevName, newName);
                    if (this.category === prevName) {
                        location.search = this.getUrl(newName);
                    }
                }
                break;
            case "delete": {
                const name = payload.name;
                const deletedIndex = bookStore2.deleteCategorySort(name);
                if (deletedIndex > -1) {
                    (_b = this.nav) === null || _b === void 0 ? void 0 : _b.querySelectorAll("a")[deletedIndex].remove();
                }
                break;
            }
            case "change": {
                const { targetIndex, draggedIndex } = payload;
                if (targetIndex === undefined || draggedIndex === undefined)
                    return;
                const navLinks = (_c = this.nav) === null || _c === void 0 ? void 0 : _c.querySelectorAll("a");
                if (navLinks) {
                    const targetEl = navLinks[targetIndex].cloneNode(true);
                    const draggedEl = navLinks[draggedIndex].cloneNode(true);
                    navLinks[draggedIndex].replaceWith(targetEl);
                    navLinks[targetIndex].replaceWith(draggedEl);
                }
            }
        }
    }
}
//# sourceMappingURL=FavoriteNav.js.map