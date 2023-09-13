// import { CustomEventEmitter } from '../../utils/index.js'
import { state } from "../../modules/model";

export default class Favorite extends HTMLElement {
    booksElement: HTMLElement;
    headerElement: HTMLElement;
    modalCateogy: HTMLElement;
    template: HTMLTemplateElement | null;
    currentNav: HTMLElement | null;

    constructor() {
        super();

        this.booksElement = this.querySelector(
            ".favorite-books"
        ) as HTMLElement;

        this.headerElement = this.querySelector(
            ".favorite-header"
        ) as HTMLElement;

        this.modalCateogy = document.querySelector(
            "overlay-category"
        ) as HTMLElement;

        this.template = document.querySelector("#tp-favorite-item");

        this.currentNav = null;
    }

    connectedCallback() {
        this.header();

        if (Object.keys(state.category).length === 0) {
            this.renderMessage();
            return;
        }

        const firstKey = Object.keys(state.category)[0];
        this.render(firstKey);
    }

    disconnectedCallback() {
        //
    }

    private header() {
        this.headerNav();
        this.overlayCatalog();
    }

    private headerNav() {
        const fragment = new DocumentFragment();
        Object.keys(state.category).forEach(
            (category: string, index: number) => {
                const el = document.createElement("button");
                el.textContent = category;
                if (index === 0) {
                    el.dataset.active = "true";
                    this.currentNav = el;
                }
                el.addEventListener("click", () => {
                    this.render(category);
                    el.dataset.active = "true";

                    if (this.currentNav) {
                        this.currentNav.dataset.active = "false";
                        this.currentNav = el;
                    }
                });
                fragment.appendChild(el);
            }
        );
        this.querySelector(".favorite-category")?.appendChild(fragment);

        this.headerElement.hidden = false;
    }

    private overlayCatalog() {
        const modal = this.modalCateogy;
        const changeButton = this.headerElement.querySelector(
            ".favorite-changeButton"
        );
        changeButton?.addEventListener("click", () => {
            modal.hidden = Boolean(!modal.hidden);
        });
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
