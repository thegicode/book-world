import {
    addFavoriteBook,
    removeFavoriteBook,
    isFavoriteBook,
    state,
    addBookInCategory,
    hasBookInCategory,
    removeBookInCategory,
} from "../modules/model";
import { updateFavoriteBooksSize } from "../modules/events";

export default class CheckboxFavoriteBook extends HTMLElement {
    protected inputElement: HTMLInputElement | null;
    protected isbn: string | null;
    categoryElement: HTMLElement | null;

    constructor() {
        super();
        this.inputElement = null;
        this.isbn = null;
        this.categoryElement = null;
    }

    connectedCallback(): void {
        const isbnElement = this.closest("[data-isbn]");

        if (isbnElement) {
            this.isbn = (
                isbnElement as HTMLElement & { dataset: { isbn: string } }
            ).dataset.isbn;
        }
        this.render();

        this.inputElement?.addEventListener("change", this.onChange.bind(this));
    }

    disconnectedCallback(): void {
        this.inputElement?.removeEventListener("change", this.onChange);
    }

    protected render(): void {
        const isbn = this.isbn || "";
        this.categoryElement = this.createCategoryElement();
        const checked = isFavoriteBook(isbn) ? "checked" : "";
        this.innerHTML = `<label>
            <input type="checkbox" name="favorite" ${checked}>
            <span>관심책</span>
        </label>`;
        this.inputElement = this.querySelector("input");

        this.appendChild(this.categoryElement);
    }

    protected onChange(): void {
        const ISBN = this.isbn || "";
        if (!ISBN || !this.inputElement) return;
        if (this.inputElement.checked) {
            addFavoriteBook(ISBN);
        } else {
            removeFavoriteBook(ISBN);
        }
        // CustomEventEmitter.dispatch('favorite-books-changed')
        updateFavoriteBooksSize();
    }

    private createCategoryElement = () => {
        const ISBN = this.isbn || "";
        const categoryElement = document.createElement("div");
        categoryElement.className = "category";
        Object.keys(state.category).forEach((category: string) => {
            const button = document.createElement("button");
            button.textContent = category;
            if (hasBookInCategory(category, ISBN)) {
                button.dataset.has = "true";
            }
            button.addEventListener("click", () => {
                const hasBook = hasBookInCategory(category, ISBN);
                hasBook
                    ? removeBookInCategory(category, ISBN)
                    : addBookInCategory(category, ISBN);
                button.dataset.has = String(!hasBook);
            });
            categoryElement.appendChild(button);
        });
        return categoryElement;
    };
}
