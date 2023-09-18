import { state } from "../../modules/model";

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

    private render(key: string) {
        const fragment = new DocumentFragment();
        const template = this.template?.content.firstElementChild;
        this.booksElement.innerHTML = "";
        if (template) {
            const data = state.category[key];

            if (data.length === 0) {
                this.renderMessage("관심책이 없습니다.");
                return;
            }

            data.forEach((isbn: string) => {
                const el = template.cloneNode(true) as HTMLElement;
                el.dataset.isbn = isbn;
                fragment.appendChild(el);
            });
        }

        this.booksElement.appendChild(fragment);
    }

    private renderMessage(message: string) {
        const template = (
            document.querySelector("#tp-message") as HTMLTemplateElement
        ).content.firstElementChild;
        if (template) {
            const element = template.cloneNode(true);
            element.textContent = message;
            this.booksElement.appendChild(element);
        }
    }
}
