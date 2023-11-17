var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Observer, CustomFetch, CustomEventEmitter } from "../../utils/index";
export default class BookList extends HTMLElement {
    constructor() {
        super();
        this.retrieveBooks = this.retrieveBooks.bind(this);
        this.initializeSearchPage = this.initializeSearchPage.bind(this);
    }
    connectedCallback() {
        this.paginationElement = this.querySelector(".paging-info");
        this.bookContainer = this.querySelector(".books");
        this.setupObserver();
        CustomEventEmitter.add("search-page-init", this.initializeSearchPage);
    }
    disconnectedCallback() {
        var _a;
        (_a = this.observer) === null || _a === void 0 ? void 0 : _a.disconnect();
        CustomEventEmitter.remove("search-page-init", this.initializeSearchPage);
    }
    setupObserver() {
        const target = this.querySelector(".observe");
        this.observer = new Observer(target, this.retrieveBooks);
    }
    initializeSearchPage(event) {
        const { keyword, sort } = event.detail;
        this.keyword = keyword;
        this.sortingOrder = sort;
        this.itemCount = 0;
        // renderBooks: onSubmit으로 들어온 경우와 브라우저
        // showDefaultMessage: keyword 없을 때 기본 화면 노출, 브라우저
        this.keyword ? this.renderBooks() : this.showDefaultMessage();
    }
    renderBooks() {
        this.renderMessage("loading");
        this.bookContainer.innerHTML = "";
        this.retrieveBooks();
    }
    showDefaultMessage() {
        this.paginationElement.hidden = true;
        this.renderMessage("message");
    }
    retrieveBooks() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.keyword || !this.sortingOrder)
                return;
            const encodedKeyword = encodeURIComponent(this.keyword);
            const searchUrl = `/search-naver-book?keyword=${encodedKeyword}&display=${10}&start=${this.itemCount + 1}&sort=${this.sortingOrder}`;
            // console.log("fetch-search: ", searchUrl);
            try {
                const data = yield CustomFetch.fetch(searchUrl);
                this.renderBookList(data);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(`Error fetching books: ${error.message}`);
                }
                else {
                    console.error("An unexpected error occurred");
                }
            }
        });
    }
    renderBookList(data) {
        var _a;
        const { total, display, items } = data;
        if (total === 0) {
            this.renderMessage("notFound");
            return;
        }
        this.itemCount += display;
        this.refreshPagingData(total, display);
        this.appendBookItems(items);
        this.paginationElement.hidden = false;
        if (total !== this.itemCount)
            (_a = this.observer) === null || _a === void 0 ? void 0 : _a.observe();
    }
    refreshPagingData(total, display) {
        const obj = {
            keyword: `${this.keyword}`,
            length: `${this.itemCount.toLocaleString()}`,
            total: `${total.toLocaleString()}`,
            display: `${display}개씩`,
        };
        for (const [key, value] of Object.entries(obj)) {
            const element = this.paginationElement.querySelector(`.__${key}`);
            element.textContent = value;
        }
    }
    appendBookItems(items) {
        const fragment = new DocumentFragment();
        const template = document.querySelector("#tp-book-item");
        items.forEach((item, index) => {
            const clonedNode = template.content.cloneNode(true);
            const bookItem = clonedNode.querySelector("book-item");
            bookItem.bookData = item;
            bookItem.dataset.index = (this.itemCount + index).toString();
            fragment.appendChild(clonedNode);
        });
        this.bookContainer.appendChild(fragment);
    }
    renderMessage(type) {
        const messageTemplate = document.querySelector(`#tp-${type}`);
        if (!messageTemplate)
            return;
        this.bookContainer.innerHTML = "";
        this.bookContainer.appendChild(messageTemplate.content.cloneNode(true));
    }
}
// this.observer = new IntersectionObserver( changes => {
//     changes.forEach( change => {
//         if (change.isIntersecting) {
//             this.observer.unobserve(change.target)
//             this.retrieveBooks()
//         }
//     })
// })
//# sourceMappingURL=BookList.js.map