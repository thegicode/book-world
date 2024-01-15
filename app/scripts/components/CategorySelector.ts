import bookModel from "../model";

export default class CategorySelector extends HTMLElement {
    protected isbn: string | null;
    button: HTMLButtonElement | null;

    constructor() {
        super();

        this.isbn = this.getISBN();
        this.button = null;

        this.onClickCategory = this.onClickCategory.bind(this);
    }

    connectedCallback() {
        this.render();
    }

    protected render() {
        this.button = this.createButton();

        this.appendChild(this.createContainer());
        this.appendChild(this.button);

        this.button?.addEventListener("click", this.onClickCategory);
    }

    private createButton() {
        const button = document.createElement("button");
        button.className = "category-button";
        button.textContent = "Category";
        return button;
    }

    private createContainer() {
        const container = document.createElement("div");
        container.className = "category";
        container.hidden = true;
        bookModel.sortedFavoriteKeys.forEach((category: string) =>
            this.createCategoryItem(container, category, this.isbn || "")
        );
        return container;
    }

    onClickCategory() {
        const el = this.querySelector(".category") as HTMLElement;
        el.hidden = !el.hidden;
    }

    private getISBN(): string | null {
        const isbnElement = this.closest("[data-isbn]") as HTMLElement;
        return isbnElement && isbnElement.dataset.isbn
            ? isbnElement.dataset.isbn
            : null;
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
        if (bookModel.hasFavoriteBook(category, ISBN)) {
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
        const isBookInCategory = bookModel.hasFavoriteBook(category, ISBN);

        if (isBookInCategory) {
            bookModel.removeFavoriteBook(category, ISBN);
        } else {
            bookModel.addFavoriteBook(category, ISBN);
        }

        checkbox.checked = !isBookInCategory;
    }
}
