import {
    addFavoriteBook,
    removeFavoriteBook,
    isFavoriteBook,
} from "../modules/model";
import { updateFavoriteBooksSize } from "../modules/events";

export default class CheckboxFavoriteBook extends HTMLElement {
    protected inputElement: HTMLInputElement | null;
    protected isbn: string | null;

    constructor() {
        super();
        this.inputElement = null;
        this.isbn = null;
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
        this.inputElement?.addEventListener("change", this.onChange);
    }

    protected render(): void {
        const isbn = this.isbn || "";
        const checked = isFavoriteBook(isbn) ? "checked" : "";
        this.innerHTML = `<label>
            <input type="checkbox" name="favorite" ${checked}>
            <span>관심책</span>
        </label>`;
        this.inputElement = this.querySelector("input");
    }

    protected onChange(): void {
        const ISBN = this.isbn || "";
        if (this.inputElement?.checked) {
            addFavoriteBook(ISBN);
        } else {
            removeFavoriteBook(ISBN);
        }
        // CustomEventEmitter.dispatch('favorite-books-changed')
        updateFavoriteBooksSize();
    }
}
