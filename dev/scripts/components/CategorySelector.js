import bookModel from "../model";
export default class CategorySelector extends HTMLElement {
    constructor() {
        super();
        this.createCategoryItem = (container, category, ISBN) => {
            const label = document.createElement("label");
            const checkbox = this.createCheckbox(category, ISBN);
            const span = document.createElement("span");
            span.textContent = category;
            label.appendChild(checkbox);
            label.appendChild(span);
            container.appendChild(label);
            return container;
        };
        this.isbn = this.getISBN();
        this.button = null;
        this.onClickCategory = this.onClickCategory.bind(this);
    }
    connectedCallback() {
        this.render();
    }
    render() {
        var _a;
        this.button = this.createButton();
        this.appendChild(this.createContainer());
        this.appendChild(this.button);
        (_a = this.button) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.onClickCategory);
    }
    createButton() {
        const button = document.createElement("button");
        button.className = "category-button";
        button.textContent = "Category";
        return button;
    }
    createContainer() {
        const container = document.createElement("div");
        container.className = "category";
        container.hidden = true;
        bookModel.sortedFavoriteKeys.forEach((category) => this.createCategoryItem(container, category, this.isbn || ""));
        return container;
    }
    onClickCategory() {
        const el = this.querySelector(".category");
        el.hidden = !el.hidden;
    }
    getISBN() {
        const isbnElement = this.closest("[data-isbn]");
        return isbnElement && isbnElement.dataset.isbn
            ? isbnElement.dataset.isbn
            : null;
    }
    createCheckbox(category, ISBN) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        if (bookModel.hasFavoriteBook(category, ISBN)) {
            checkbox.checked = true;
        }
        checkbox.addEventListener("change", () => this.onChange(checkbox, category, ISBN));
        return checkbox;
    }
    onChange(checkbox, category, ISBN) {
        const isBookInCategory = bookModel.hasFavoriteBook(category, ISBN);
        if (isBookInCategory) {
            bookModel.removeFavoriteBook(category, ISBN);
        }
        else {
            bookModel.addFavoriteBook(category, ISBN);
        }
        checkbox.checked = !isBookInCategory;
    }
}
//# sourceMappingURL=CategorySelector.js.map