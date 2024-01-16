import bookModel from "../model";

export default class CategorySelector extends HTMLElement {
    protected isbn: string | null;
    private container: HTMLElement | null;
    button: HTMLButtonElement | null;

    constructor() {
        super();

        this.isbn = this.getISBN();
        this.button = null;
        this.container = null;

        this.onClickCategory = this.onClickCategory.bind(this);
        this.handleCategoryUpdate = this.handleCategoryUpdate.bind(this);
    }

    connectedCallback() {
        this.button = this.createButton();
        this.container = this.createContainer();

        this.render();

        this.button?.addEventListener("click", this.onClickCategory);
        bookModel.subscribeFavoriteCategoriesUpdate(this.handleCategoryUpdate);
    }

    protected render() {
        if (!this.container || !this.button) return;

        bookModel.sortedFavoriteKeys
            .map(
                (category: string) =>
                    this.createCategoryItem(category) as HTMLLabelElement
            )
            .forEach((label) => this.container?.appendChild(label));

        this.appendChild(this.container);
        this.appendChild(this.button);
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
        return container;
    }

    private createCategoryItem = (category: string) => {
        if (!this.container) return;

        const label = document.createElement("label");
        const checkbox = this.createCheckbox(category);
        const span = document.createElement("span");
        span.textContent = category;

        label.appendChild(checkbox);
        label.appendChild(span);

        return label;
    };

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

    private createCheckbox(category: string) {
        const ISBN = this.isbn || "";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        if (bookModel.hasFavoriteBook(category, ISBN)) {
            checkbox.checked = true;
        }

        checkbox.addEventListener("change", () =>
            this.onChange(checkbox, category)
        );

        return checkbox;
    }

    private onChange(checkbox: HTMLInputElement, category: string) {
        const ISBN = this.isbn || "";
        const isBookInCategory = bookModel.hasFavoriteBook(category, ISBN);

        if (isBookInCategory) {
            bookModel.removeFavoriteBook(category, ISBN);
        } else {
            bookModel.addFavoriteBook(category, ISBN);
        }

        checkbox.checked = !isBookInCategory;
    }

    private handleCategoryUpdate({
        type,
        payload,
    }: {
        type: string;
        payload: ICategoryPayload;
    }) {
        const actions: Record<string, () => void> = {
            add: () => this.handleAdd(payload.name as string),
            rename: () => this.reanmeCategory(payload.newName as string),
            change: () =>
                this.changeCategory(
                    payload.targetIndex as number,
                    payload.draggedIndex as number
                ),
            delete: () => this.handleDelete(payload.name as string),
        };

        if (actions[type]) {
            actions[type]();
        } else {
            console.error("no type");
        }
    }

    private handleAdd(name: string) {
        this.container?.appendChild(
            this.createCategoryItem(name as string) as HTMLLabelElement
        );
    }

    private handleDelete(name: string) {
        this.querySelectorAll("label span").forEach((item, index) => {
            if (item.textContent === name) {
                this.querySelectorAll("label")[index].remove();
            }
        });
    }

    private changeCategory(targetIndex: number, draggedIndex: number) {
        const labels = this.querySelectorAll("label");

        const targetElement = this.createCategoryItem(
            labels[draggedIndex].querySelector("span")?.textContent as string
        ) as HTMLLabelElement;
        const dragElement = this.createCategoryItem(
            labels[targetIndex].querySelector("span")?.textContent as string
        ) as HTMLLabelElement;

        labels[targetIndex].replaceWith(targetElement);
        labels[draggedIndex].replaceWith(dragElement);
    }

    private reanmeCategory(newName: string) {
        const prevElement =
            this.querySelectorAll("label")[
                bookModel.sortedFavoriteKeys.indexOf(newName)
            ];

        const newElement = this.createCategoryItem(newName) as HTMLLabelElement;

        prevElement.replaceWith(newElement);
    }
}
