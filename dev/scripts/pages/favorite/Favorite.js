import bookModel from "../../model";
import { cloneTemplate } from "../../utils/helpers";
export default class Favorite extends HTMLElement {
    constructor() {
        super();
        this.booksElement = this.querySelector(".favorite-books");
        this.template = document.querySelector("#tp-favorite-item");
        const params = new URLSearchParams(location.search);
        this.locationCategory = params.get("category");
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
    render(key) {
        const fragment = new DocumentFragment();
        this.booksElement.innerHTML = "";
        const data = bookModel.getFavorites()[key];
        if (data.length === 0) {
            this.renderMessage("관심책이 없습니다.");
            return;
        }
        data.forEach((isbn) => {
            if (this.template === null) {
                throw Error("Template is null");
            }
            const el = cloneTemplate(this.template);
            el.dataset.isbn = isbn;
            fragment.appendChild(el);
        });
        this.booksElement.appendChild(fragment);
    }
    renderMessage(message) {
        const template = document.querySelector("#tp-message");
        if (template) {
            const element = cloneTemplate(template);
            element.textContent = message;
            this.booksElement.appendChild(element);
        }
    }
}
//# sourceMappingURL=Favorite.js.map