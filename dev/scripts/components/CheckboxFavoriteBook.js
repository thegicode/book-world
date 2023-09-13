import { state, addBookInCategory, hasBookInCategory, removeBookInCategory, } from "../modules/model";
import { updateBookSizeInCategor } from "../modules/events";
export default class CheckboxFavoriteBook extends HTMLElement {
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
    }
    connectedCallback() {
        this.render();
    }
    render() {
        const container = this.createContainer();
        this.innerHTML = `<h5>Category</h5>`;
        this.appendChild(container);
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
        Object.keys(state.category).forEach((category) => this.createCategoryItem(container, category, this.isbn || ""));
        return container;
    }
    createCheckbox(category, ISBN) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        if (hasBookInCategory(category, ISBN)) {
            checkbox.checked = true;
        }
        checkbox.addEventListener("change", () => this.onChange(checkbox, category, ISBN));
        return checkbox;
    }
    onChange(checkbox, category, ISBN) {
        const isBookInCategory = hasBookInCategory(category, ISBN);
        if (isBookInCategory) {
            removeBookInCategory(category, ISBN);
        }
        else {
            addBookInCategory(category, ISBN);
        }
        checkbox.checked = !isBookInCategory;
        updateBookSizeInCategor();
    }
}
//# sourceMappingURL=CheckboxFavoriteBook.js.map