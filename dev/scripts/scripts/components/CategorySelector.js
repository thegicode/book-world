import bookStore from "../modules/BookStore";
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
        const button = this.createButton();
        const container = this.createContainer();
        this.button = button;
        this.appendChild(container);
        this.appendChild(button);
        (_a = this.button) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.onClickCategory);
    }
    createButton() {
        const button = document.createElement("button");
        button.className = "category-button";
        button.textContent = "Category";
        return button;
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
    createContainer() {
        const container = document.createElement("div");
        container.className = "category";
        container.hidden = true;
        bookStore.categorySort.forEach((category) => this.createCategoryItem(container, category, this.isbn || ""));
        return container;
    }
    createCheckbox(category, ISBN) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        if (bookStore.hasBookInCategory(category, ISBN)) {
            checkbox.checked = true;
        }
        checkbox.addEventListener("change", () => this.onChange(checkbox, category, ISBN));
        return checkbox;
    }
    onChange(checkbox, category, ISBN) {
        const isBookInCategory = bookStore.hasBookInCategory(category, ISBN);
        if (isBookInCategory) {
            bookStore.removeBookInCategory(category, ISBN);
        }
        else {
            bookStore.addBookInCategory(category, ISBN);
        }
        checkbox.checked = !isBookInCategory;
    }
}
//# sourceMappingURL=CategorySelector.js.map