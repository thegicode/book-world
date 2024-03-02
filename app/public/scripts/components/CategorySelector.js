import bookModel from "../model";
export default class CategorySelector extends HTMLElement {
    constructor() {
        super();
        this.createCategoryItem = (category) => {
            if (!this.container)
                return;
            const label = document.createElement("label");
            const checkbox = this.createCheckbox(category);
            const span = document.createElement("span");
            span.textContent = category;
            label.appendChild(checkbox);
            label.appendChild(span);
            return label;
        };
        this.isbn = this.getISBN();
        this.button = null;
        this.container = null;
        this.onClickCategory = this.onClickCategory.bind(this);
        this.handleCategoryUpdate = this.handleCategoryUpdate.bind(this);
    }
    connectedCallback() {
        var _a;
        this.button = this.createButton();
        this.container = this.createContainer();
        this.render();
        (_a = this.button) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.onClickCategory);
        bookModel.subscribeFavoriteCategoriesUpdate(this.handleCategoryUpdate);
    }
    render() {
        if (!this.container || !this.button)
            return;
        bookModel.sortedFavoriteKeys
            .map((category) => this.createCategoryItem(category))
            .forEach((label) => { var _a; return (_a = this.container) === null || _a === void 0 ? void 0 : _a.appendChild(label); });
        this.appendChild(this.container);
        this.appendChild(this.button);
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
    createCheckbox(category) {
        const ISBN = this.isbn || "";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        if (bookModel.hasFavoriteBook(category, ISBN)) {
            checkbox.checked = true;
        }
        checkbox.addEventListener("change", () => this.onChange(checkbox, category));
        return checkbox;
    }
    onChange(checkbox, category) {
        const ISBN = this.isbn || "";
        const isBookInCategory = bookModel.hasFavoriteBook(category, ISBN);
        if (isBookInCategory) {
            bookModel.removeFavoriteBook(category, ISBN);
        }
        else {
            bookModel.addFavoriteBook(category, ISBN);
        }
        checkbox.checked = !isBookInCategory;
    }
    handleCategoryUpdate({ type, payload, }) {
        const actions = {
            add: () => this.handleAdd(payload.name),
            rename: () => this.reanmeCategory(payload.newName),
            change: () => this.changeCategory(payload.targetIndex, payload.draggedIndex),
            delete: () => this.handleDelete(payload.name),
        };
        if (actions[type]) {
            actions[type]();
        }
        else {
            console.error("no type");
        }
    }
    handleAdd(name) {
        var _a;
        (_a = this.container) === null || _a === void 0 ? void 0 : _a.appendChild(this.createCategoryItem(name));
    }
    handleDelete(name) {
        this.querySelectorAll("label span").forEach((item, index) => {
            if (item.textContent === name) {
                this.querySelectorAll("label")[index].remove();
            }
        });
    }
    changeCategory(targetIndex, draggedIndex) {
        var _a, _b;
        const labels = this.querySelectorAll("label");
        const targetElement = this.createCategoryItem((_a = labels[draggedIndex].querySelector("span")) === null || _a === void 0 ? void 0 : _a.textContent);
        const dragElement = this.createCategoryItem((_b = labels[targetIndex].querySelector("span")) === null || _b === void 0 ? void 0 : _b.textContent);
        labels[targetIndex].replaceWith(targetElement);
        labels[draggedIndex].replaceWith(dragElement);
    }
    reanmeCategory(newName) {
        const prevElement = this.querySelectorAll("label")[bookModel.sortedFavoriteKeys.indexOf(newName)];
        const newElement = this.createCategoryItem(newName);
        prevElement.replaceWith(newElement);
    }
}
//# sourceMappingURL=CategorySelector.js.map