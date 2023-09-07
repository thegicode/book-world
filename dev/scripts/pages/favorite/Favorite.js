// import { CustomEventEmitter } from '../../utils/index.js'
import { state } from "../../modules/model";
export default class Favorite extends HTMLElement {
    constructor() {
        super();
        this.booksElement = this.querySelector(".favorite-books");
        this.headerElement = this.querySelector(".favorite-header");
        this.modalCateogy = document.querySelector("overlay-category");
        this.template = document.querySelector("#tp-favorite-item");
    }
    connectedCallback() {
        if (Object.keys(state.category).length === 0) {
            this.renderMessage();
            return;
        }
        this.header();
        const firstKey = Object.keys(state.category)[0];
        this.render(firstKey);
    }
    disconnectedCallback() {
        //
    }
    header() {
        this.headerNav();
        this.overlayCatalog();
    }
    headerNav() {
        var _a;
        const fragment = new DocumentFragment();
        Object.keys(state.category).forEach((category) => {
            const el = document.createElement("button");
            el.textContent = category;
            el.addEventListener("click", () => {
                this.render(category);
            });
            fragment.appendChild(el);
        });
        (_a = this.querySelector(".favorite-category")) === null || _a === void 0 ? void 0 : _a.appendChild(fragment);
        this.headerElement.hidden = false;
    }
    overlayCatalog() {
        const modal = this.modalCateogy;
        const changeButton = this.headerElement.querySelector(".favorite-changeButton");
        changeButton === null || changeButton === void 0 ? void 0 : changeButton.addEventListener("click", () => {
            modal.hidden = Boolean(!modal.hidden);
        });
    }
    render(key) {
        var _a;
        const fragment = new DocumentFragment();
        const template = (_a = this.template) === null || _a === void 0 ? void 0 : _a.content.firstElementChild;
        this.booksElement.innerHTML = "";
        if (template) {
            state.category[key].forEach((isbn) => {
                const el = template.cloneNode(true);
                el.dataset.isbn = isbn;
                fragment.appendChild(el);
            });
        }
        this.booksElement.appendChild(fragment);
    }
    renderMessage() {
        const template = document.querySelector("#tp-message").content.firstElementChild;
        if (template) {
            const element = template.cloneNode(true);
            element.textContent = "관심책을 등록해주세요.";
            this.booksElement.appendChild(element);
        }
    }
}
//# sourceMappingURL=Favorite.js.map