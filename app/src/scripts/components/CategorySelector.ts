import { html, render } from "lit";
import bookModel, { BookModelEvent } from "@/model";

export default class CategorySelector extends HTMLElement {
    protected isbn: string | null;
    private isOpen = false;

    constructor() {
        super();
        this.isbn = this.getISBN();
        this.handleCategoryUpdate = this.handleCategoryUpdate.bind(this);
    }

    connectedCallback() {
        this.render();
        bookModel.subscribe(
            BookModelEvent.FavoriteCategoriesUpdate,
            this.handleCategoryUpdate,
        );
    }

    private getISBN(): string | null {
        const isbnElement = this.closest("[data-isbn]") as HTMLElement;
        return isbnElement?.dataset.isbn || null;
    }

    private toggleOpen = () => {
        this.isOpen = !this.isOpen;
        this.render();
    };

    private onCategoryChange = (category: string) => {
        const ISBN = this.isbn || "";
        const isBookInCategory = bookModel.hasFavoriteBook(category, ISBN);

        if (isBookInCategory) {
            bookModel.removeFavoriteBook(category, ISBN);
        } else {
            bookModel.addFavoriteBook(category, ISBN);
        }

        this.render();
    };

    private handleCategoryUpdate = () => {
        this.render();
    };

    protected render() {
        const categories = bookModel.favoriteCategoryOrder;
        const ISBN = this.isbn || "";

        const template = html`
            <div class="category" ?hidden=${!this.isOpen}>
                ${categories.map(
                    (category) =>
                        html`<label
                            ><input
                                type="checkbox"
                                .checked=${bookModel.hasFavoriteBook(
                                    category,
                                    ISBN,
                                )}
                                @change=${() => this.onCategoryChange(category)}
                            /><span>${category}</span></label
                        >`,
                )}
            </div>
            <button class="category-button" @click=${this.toggleOpen}>
                Category
            </button>
        `;

        render(template, this);
    }
}
