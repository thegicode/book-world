var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import BookItem from "./BookItem";
import { Observer, CustomFetch } from "../../utils/index";
import { URL } from "../../utils/constants";
export default class BookList extends HTMLElement {
    constructor() {
        super();
        this.paginationElement = this.querySelector(".paging-info");
        this.bookContainer = this.querySelector(".books");
        this.loadingComponent =
            this.querySelector("loading-component");
        this.observeTarget = this.querySelector(".observe");
        this.itemTemplate = document.querySelector("#tp-book-item");
        this.itemsPerPage = 10;
        this.fetchBooks = this.fetchBooks.bind(this);
        this.initializeSearchPage = this.initializeSearchPage.bind(this);
    }
    connectedCallback() {
        this.observer = new Observer(this.observeTarget, this.fetchBooks);
    }
    disconnectedCallback() {
        var _a;
        (_a = this.observer) === null || _a === void 0 ? void 0 : _a.disconnect();
    }
    initializeSearchPage(keyword, sortValue) {
        var _a;
        this.keyword = keyword;
        this.sortingOrder = sortValue;
        this.currentItemCount = 0;
        (_a = this.observer) === null || _a === void 0 ? void 0 : _a.disconnect();
        // loadBooks: onSubmit으로 들어온 경우와 브라우저
        // showDefaultMessage: keyword 없을 때 기본 화면 노출, 브라우저
        this.keyword ? this.loadBooks() : this.showDefaultMessage();
    }
    loadBooks() {
        var _a, _b;
        this.bookContainer.innerHTML = "";
        (_a = this.loadingComponent) === null || _a === void 0 ? void 0 : _a.show();
        this.fetchBooks();
        (_b = this.loadingComponent) === null || _b === void 0 ? void 0 : _b.hide();
    }
    fetchBooks() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.keyword || !this.sortingOrder) {
                return;
            }
            const searchUrl = `${URL.search}?keyword=${encodeURIComponent(this.keyword)}&display=${this.itemsPerPage}&start=${this.currentItemCount + 1}&sort=${this.sortingOrder}`;
            try {
                const data = yield CustomFetch.fetch(searchUrl);
                this.render(data);
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
    render(bookData) {
        var _a;
        if (!bookData)
            return;
        if (bookData.total === 0) {
            this.renderMessage("notFound");
            return;
        }
        this.currentItemCount += bookData.display;
        this.updatePagingInfo(bookData.total);
        this.renderList(bookData.items);
        if (bookData.total !== this.currentItemCount) {
            (_a = this.observer) === null || _a === void 0 ? void 0 : _a.observe();
        }
    }
    updatePagingInfo(total) {
        const obj = {
            keyword: `${this.keyword}`,
            length: `${this.currentItemCount.toLocaleString()}`,
            total: `${total.toLocaleString()}`,
            display: `${this.itemsPerPage}개씩`,
        };
        for (const [key, value] of Object.entries(obj)) {
            const element = this.paginationElement.querySelector(`.__${key}`);
            element.textContent = value;
        }
        this.paginationElement.hidden = false;
    }
    renderList(searchBookData) {
        const fragment = new DocumentFragment();
        searchBookData
            .map((data, index) => this.createItem(data, index))
            .forEach((bookItem) => fragment.appendChild(bookItem));
        this.bookContainer.appendChild(fragment);
    }
    createItem(data, index) {
        const bookItem = new BookItem(data);
        bookItem.dataset.index = this.getIndex(index).toString();
        bookItem.appendChild(this.itemTemplate.content.cloneNode(true));
        return bookItem;
    }
    getIndex(index) {
        return (Math.ceil((this.currentItemCount - this.itemsPerPage) / this.itemsPerPage) *
            this.itemsPerPage +
            index);
    }
    showDefaultMessage() {
        this.paginationElement.hidden = true;
        this.renderMessage("message");
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
//             this.fetchBooks()
//         }
//     })
// })
//# sourceMappingURL=BookList.js.map