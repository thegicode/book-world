import { state } from "../../modules/model";
export default class Favorite extends HTMLElement {
    constructor() {
        super();
        this.booksElement = this.querySelector(".favorite-books");
        this.template = document.querySelector("#tp-favorite-item");
        const params = new URLSearchParams(location.search);
        this.locationCategory = params.get("category");
    }
    connectedCallback() {
        if (state.categorySort.length === 0) {
            this.renderMessage("관심 카테고리를 등록해주세요.");
            return;
        }
        const key = this.locationCategory || state.categorySort[0];
        this.render(key);
    }
    disconnectedCallback() {
        //
    }
    render(key) {
        var _a;
        const fragment = new DocumentFragment();
        const template = (_a = this.template) === null || _a === void 0 ? void 0 : _a.content.firstElementChild;
        this.booksElement.innerHTML = "";
        if (template) {
            const data = state.category[key];
            if (data.length === 0) {
                this.renderMessage("관심책이 없습니다.");
                return;
            }
            data.forEach((isbn) => {
                const el = template.cloneNode(true);
                el.dataset.isbn = isbn;
                fragment.appendChild(el);
            });
        }
        this.booksElement.appendChild(fragment);
    }
    renderMessage(message) {
        const template = document.querySelector("#tp-message").content.firstElementChild;
        if (template) {
            const element = template.cloneNode(true);
            element.textContent = message;
            this.booksElement.appendChild(element);
        }
    }
}
//# sourceMappingURL=Favorite.js.map