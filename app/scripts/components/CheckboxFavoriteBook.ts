import {
    state,
    addBookInCategory,
    hasBookInCategory,
    removeBookInCategory,
} from "../modules/model";
import { updateBookSizeInCategor } from "../modules/events";

export default class CheckboxFavoriteBook extends HTMLElement {
    protected isbn: string | null;

    constructor() {
        super();

        this.isbn = this.getISBN();
    }

    connectedCallback() {
        this.render();
    }

    protected render() {
        const container = this.createContainer();

        this.innerHTML = `<h5>Category</h5>`;
        this.appendChild(container);
    }

    private getISBN(): string | null {
        const isbnElement = this.closest("[data-isbn]") as HTMLElement;
        return isbnElement && isbnElement.dataset.isbn
            ? isbnElement.dataset.isbn
            : null;
    }

    private createContainer() {
        const container = document.createElement("div");
        container.className = "category";
        Object.keys(state.category).forEach((category: string) =>
            this.createCategoryItem(container, category, this.isbn || "")
        );
        return container;
    }

    private createCategoryItem = (
        container: HTMLElement,
        category: string,
        ISBN: string
    ) => {
        const label = document.createElement("label");
        const checkbox = this.createCheckbox(category, ISBN);
        const span = document.createElement("span");
        span.textContent = category;

        label.appendChild(checkbox);
        label.appendChild(span);

        container.appendChild(label);
        return container;
    };

    private createCheckbox(category: string, ISBN: string) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        if (hasBookInCategory(category, ISBN)) {
            checkbox.checked = true;
        }

        checkbox.addEventListener("change", () =>
            this.onChange(checkbox, category, ISBN)
        );

        return checkbox;
    }

    private onChange(
        checkbox: HTMLInputElement,
        category: string,
        ISBN: string
    ) {
        const isBookInCategory = hasBookInCategory(category, ISBN);

        if (isBookInCategory) {
            removeBookInCategory(category, ISBN);
        } else {
            addBookInCategory(category, ISBN);
        }

        checkbox.checked = !isBookInCategory;
        updateBookSizeInCategor();
    }
}
