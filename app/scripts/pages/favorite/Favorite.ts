import bookStore from "../../modules/BookStore";
import { cloneTemplate } from "../../utils/helpers";

export default class Favorite extends HTMLElement {
    booksElement: HTMLElement;
    template: HTMLTemplateElement | null;
    locationCategory: string | null;

    constructor() {
        super();

        this.booksElement = this.querySelector(
            ".favorite-books"
        ) as HTMLElement;

        this.template = document.querySelector("#tp-favorite-item");

        const params = new URLSearchParams(location.search);
        this.locationCategory = params.get("category");
    }

    connectedCallback() {
        if (bookStore.categorySort.length === 0) {
            this.renderMessage("관심 카테고리를 등록해주세요.");
            return;
        }

        const key = this.locationCategory || bookStore.categorySort[0];
        this.render(key);
    }

    disconnectedCallback() {
        //
    }

    private render(key: string) {
        const fragment = new DocumentFragment();
        this.booksElement.innerHTML = "";
        const data = bookStore.category[key];

        if (data.length === 0) {
            this.renderMessage("관심책이 없습니다.");
            return;
        }

        data.forEach((isbn: string) => {
            if (this.template === null) {
                throw Error("Template is null");
            }

            const el = cloneTemplate(this.template);
            el.dataset.isbn = isbn;
            fragment.appendChild(el);
        });

        this.booksElement.appendChild(fragment);
    }

    private renderMessage(message: string) {
        const template = document.querySelector(
            "#tp-message"
        ) as HTMLTemplateElement;
        if (template) {
            const element = cloneTemplate(template);
            element.textContent = message;
            this.booksElement.appendChild(element);
        }
    }
}
