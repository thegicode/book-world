import bookModel from "../../model";
import { cloneTemplate } from "../../utils/helpers";
import FavoriteItem from "./FavoriteItem";
export default class Favorite extends HTMLElement {
    constructor() {
        super();
        this.booksElement = this.querySelector(".favorite-books");
        this.itemTemplate = document.querySelector("#tp-favorite-item");
        this.locationCategory = new URLSearchParams(location.search).get("category");
    }
    connectedCallback() {
        const categorySort = bookModel.sortedFavoriteKeys;
        if (categorySort.length === 0) {
            this.renderMessage("관심 카테고리를 등록해주세요.");
            return;
        }
        const categoryName = this.locationCategory || categorySort[0];
        this.render(categoryName);
    }
    disconnectedCallback() {
        //
    }
    render(categoryName) {
        if (!this.booksElement)
            return;
        this.booksElement.innerHTML = "";
        const isbns = bookModel.favorites[categoryName];
        if (isbns.length === 0) {
            this.renderMessage("관심책이 없습니다.");
            return;
        }
        const fragment = new DocumentFragment();
        for (const isbn of isbns) {
            if (!this.itemTemplate)
                return;
            const favoriteItem = new FavoriteItem(isbn);
            const cloned = this.itemTemplate.content.cloneNode(true);
            favoriteItem.appendChild(cloned);
            fragment.appendChild(favoriteItem);
        }
        this.booksElement.appendChild(fragment);
    }
    renderMessage(message) {
        const template = document.querySelector("#tp-message");
        if (template && this.booksElement) {
            const element = cloneTemplate(template);
            element.textContent = message;
            this.booksElement.appendChild(element);
        }
    }
}
//# sourceMappingURL=Favorite.js.map