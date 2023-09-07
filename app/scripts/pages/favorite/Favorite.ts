// import { CustomEventEmitter } from '../../utils/index.js'
import { getState } from "../../modules/model";

export default class Favorite extends HTMLElement {
    // static get observedAttributes() {
    //     return ['count']
    // }

    booksElement: HTMLElement;
    headerElement: HTMLElement;
    modalCateogy: HTMLElement;
    // $countEl
    // $observer

    // set count(value) {
    //     this.setAttribute('count', value)
    // }
    // get count() {
    //     return this.getAttribute('count')
    // }

    get favoriteBooks() {
        return getState().favoriteBooks;
    }

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

        // this.$countEl = this.querySelector('.count')

        // this.updateCount = this.updateCount.bind(this)
        // CustomEventEmitter.add('favorite-books-changed', this.updateFavoriteBooksSize.bind(this))
    }

    connectedCallback() {
        // 속성 변경을 감지하기 위해 MutationObserver를 사용합니다.
        // this.$observer = new MutationObserver(this.updateCount)
        // this.$observer = new MutationObserver(mutations => {
        //     for (const mutation of mutations) {
        //         if (mutation.attributeName === 'count') {
        //             this.updateCount()
        //         } else if (mutation.type ==='childList') {

        //         }
        //     }
        // })
        // this.$observer.observe(this, { attributes: true, childList: true, subtree: true })

        // this.updateCount()

        this.header();

        if (this.favoriteBooks.length === 0) {
            this.renderMessage();
            return;
        }
        this.render();
    }

    disconnectedCallback() {
        // this.$observer.disconnect();
    }

    // updateFavoriteBooksSize({ detail }) {
    //     this.count = detail.count
    // }

    // updateCount() {
    //     const count = this.count || this.favoriteBooks.length
    //     this.$countEl.textContent = `${count}권`
    // }

    private render() {
        const fragment = new DocumentFragment();
        const template = (
            document.querySelector("#tp-favorite-item") as HTMLTemplateElement
        ).content.firstElementChild;
        if (template) {
            this.favoriteBooks.forEach((isbn) => {
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

    // attributeChangedCallback(name, oldValue, newValue) {
    //     if (name === 'count') {
    //         this.updateCount()
    //     }
    // }

    private header() {
        const modal = this.modalCateogy;
        const changeButton = this.headerElement.querySelector(
            ".favorite-changeButton"
        );

        changeButton?.addEventListener("click", () => {
            modal.hidden = Boolean(!modal.hidden);
        });
    }
}
