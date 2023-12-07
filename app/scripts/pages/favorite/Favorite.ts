import bookModel from "../../model";
import { cloneTemplate } from "../../utils/helpers";
import FavoriteItem from "./FavoriteItem";

export default class Favorite extends HTMLElement {
    booksElement: HTMLElement | null;
    itemTemplate: HTMLTemplateElement | null;
    locationCategory: string | null;

    constructor() {
        super();

        this.booksElement = this.querySelector(".favorite-books");
        this.itemTemplate = document.querySelector("#tp-favorite-item");
        this.locationCategory = new URLSearchParams(location.search).get(
            "category"
        );
    }

    connectedCallback() {
        const categorySort = bookModel.getSortedFavoriteKeys();
        if (categorySort.length === 0) {
            this.renderMessage("관심 카테고리를 등록해주세요.");
            return;
        }

        const key = this.locationCategory || categorySort[0];
        this.render(key);
    }

    disconnectedCallback() {
        //
    }

    private render(key: string) {
        if (!this.booksElement) return;
        this.booksElement.innerHTML = "";

        const data = bookModel.getFavorites()[key];
        if (data.length === 0) {
            this.renderMessage("관심책이 없습니다.");
            return;
        }

        const fragment = new DocumentFragment();
        data.forEach((isbn: string) => {
            if (!this.itemTemplate) return;

            const favoriteItem = new FavoriteItem(isbn);
            const cloned = this.itemTemplate.content.cloneNode(true);
            favoriteItem.appendChild(cloned);
            fragment.appendChild(favoriteItem);
        });

        this.booksElement.appendChild(fragment);
    }

    private renderMessage(message: string) {
        const template = document.querySelector(
            "#tp-message"
        ) as HTMLTemplateElement;
        if (template && this.booksElement) {
            const element = cloneTemplate(template);
            element.textContent = message;
            this.booksElement.appendChild(element);
        }
    }
}
