import { state, addBookInCategory, hasBookInCategory, removeBookInCategory, } from "../modules/model";
import { updateBookSizeInCategor } from "../modules/events";
export default class CheckboxFavoriteBook extends HTMLElement {
    constructor() {
        super();
        this.createCategoryElement = () => {
            const ISBN = this.isbn || "";
            const categoryElement = document.createElement("div");
            categoryElement.className = "category";
            Object.keys(state.category).forEach((category) => {
                const label = document.createElement("label");
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                const span = document.createElement("span");
                span.textContent = category;
                if (hasBookInCategory(category, ISBN)) {
                    checkbox.checked = true;
                }
                checkbox.addEventListener("change", () => this.onChange(checkbox, category, ISBN));
                label.appendChild(checkbox);
                label.appendChild(span);
                categoryElement.appendChild(label);
            });
            return categoryElement;
        };
        this.inputElement = null;
        this.isbn = null;
        this.categoryElement = null;
    }
    connectedCallback() {
        const isbnElement = this.closest("[data-isbn]");
        if (isbnElement) {
            this.isbn = isbnElement.dataset.isbn;
        }
        this.render();
    }
    // disconnectedCallback() {}
    render() {
        this.categoryElement = this.createCategoryElement();
        this.innerHTML = `<h5>Category</h5>`;
        this.appendChild(this.categoryElement);
    }
    onChange(checkbox, category, ISBN) {
        const hasBook = hasBookInCategory(category, ISBN);
        hasBook
            ? removeBookInCategory(category, ISBN)
            : addBookInCategory(category, ISBN);
        checkbox.checked = !hasBook;
        updateBookSizeInCategor();
    }
}
//# sourceMappingURL=CheckboxFavoriteBook.js.map