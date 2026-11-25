import bookModel, { BookModelEvent } from "@/model";
import { cloneTemplate } from "@/utils/helpers";
import BookWhereFavoriteItem from "./BookWhereFavoriteItem";

export default class BookWhereFavorite extends HTMLElement {
    private currentCategory: string | null;
    private listElement: HTMLElement | null;
    private messageTemplate: HTMLTemplateElement;

    constructor() {
        super();

        this.currentCategory = new URLSearchParams(location.search).get("category");
        this.listElement = this.querySelector(".favorite-books");
        this.messageTemplate = document.querySelector(
            "#tp-message"
        ) as HTMLTemplateElement;

        this.onStateChange = this.onStateChange.bind(this);
    }

    connectedCallback() {
        this.updateList();

        bookModel
            .getPublisher(BookModelEvent.FavoriteBookUpdate)
            .subscribe(this.onStateChange);
        bookModel
            .getPublisher(BookModelEvent.FavoriteCategoriesUpdate)
            .subscribe(this.onStateChange);
    }

    disconnectedCallback() {
        bookModel
            .getPublisher(BookModelEvent.FavoriteBookUpdate)
            .unsubscribe(this.onStateChange);
        bookModel
            .getPublisher(BookModelEvent.FavoriteCategoriesUpdate)
            .unsubscribe(this.onStateChange);
    }

    private onStateChange() {
        this.updateList();
    }

    private updateList() {
        this.currentCategory = new URLSearchParams(location.search).get("category");
        const isbnsOfCategory = this.getIsbnsOfCategory();
        if (isbnsOfCategory && isbnsOfCategory.length > 0) {
            this.render(isbnsOfCategory);
        }
    }

    private getIsbnsOfCategory(): string[] | undefined {
        const categoryKeys = bookModel.favoriteCategoryOrder;
        const favorites = bookModel.favorites;

        const selectedCat = this.currentCategory || (categoryKeys.length > 0 ? categoryKeys[0] : "전체");

        if (selectedCat === "전체") {
            const allIsbns = new Set<string>();
            Object.values(favorites).forEach((list) => {
                list.forEach((isbn) => allIsbns.add(isbn));
            });
            const isbns = Array.from(allIsbns);
            if (isbns.length === 0) {
                this.renderMessage("등록된 관심 책이 없습니다.");
                return;
            }
            return isbns;
        }

        const isbnsOfCategory = favorites[selectedCat] || [];
        if (isbnsOfCategory.length === 0) {
            this.renderMessage(`'${selectedCat}' 카테고리에 등록된 관심 책이 없습니다.`);
            return;
        }

        return isbnsOfCategory;
    }

    private render(isbnsOfCategory: string[]) {
        if (!this.listElement) return;
        const fragment = new DocumentFragment();
        isbnsOfCategory
            .map((isbn) => this.createItem(isbn))
            .forEach((element) => fragment.appendChild(element));

        this.listElement.innerHTML = "";
        this.listElement.appendChild(fragment);
    }

    private createItem(isbn: string) {
        return new BookWhereFavoriteItem(isbn);
    }

    private renderMessage(message: string) {
        if (!this.messageTemplate || !this.listElement) return;

        this.listElement.innerHTML = "";
        const messageElement = cloneTemplate(this.messageTemplate);
        messageElement.textContent = message;
        this.listElement.appendChild(messageElement);
    }
}
