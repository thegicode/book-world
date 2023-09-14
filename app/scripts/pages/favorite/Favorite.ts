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
        if (Object.keys(state.category).length === 0) {
            this.renderMessage();
            return;
        }

        const key = this.locationCategory || Object.keys(state.category)[0];
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
            state.category[key].forEach((isbn: string) => {
                const el = template.cloneNode(true) as HTMLElement;
                el.dataset.isbn = isbn;
                fragment.appendChild(el);
            });
        }

        this.booksElement.appendChild(fragment);
    }

    private renderMessage() {
        const template = (
            document.querySelector("#tp-message") as HTMLTemplateElement
        ).content.firstElementChild;
        if (template) {
            const element = template.cloneNode(true);
            element.textContent = "관심책을 등록해주세요.";
            this.booksElement.appendChild(element);
        }
    }
}
