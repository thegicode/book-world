var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CustomFetch } from "../../utils/index";
export default class Book extends HTMLElement {
    constructor() {
        super();
        this.loadingElement = null;
        this.data = null;
        this.recBookTemplate = document.querySelector("#tp-recBookItem");
    }
    connectedCallback() {
        this.loadingElement = this.querySelector(".loading");
        const isbn = new URLSearchParams(location.search).get("isbn");
        this.dataset.isbn = isbn;
        this.fetchUsageAnalysisList(isbn);
    }
    fetchUsageAnalysisList(isbn) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield CustomFetch.fetch(`/usage-analysis-list?isbn13=${isbn}`);
                this.data = data;
                console.log(data);
                this.render();
            }
            catch (error) {
                this.renderError();
                console.error(error);
                throw new Error(`Fail to get usage analysis list.`);
            }
        });
    }
    render() {
        if (!this.data)
            return;
        const { book, keywords, coLoanBooks, maniaRecBooks, readerRecBooks } = this.data; // coLoanBooks, loanGrps,loanHistory,
        this.renderBook(book);
        this.renderKeyword(keywords);
        this.renderCoLeanBooks(coLoanBooks);
        this.renderManiaBooks(maniaRecBooks);
        this.renderReaderBooks(readerRecBooks);
        if (this.loadingElement) {
            this.loadingElement.remove();
            this.loadingElement = null;
        }
    }
    renderBook(book) {
        const { bookname, authors, bookImageURL, class_nm, class_no, description, isbn13, loanCnt, publication_year, publisher, } = book;
        const bookNames = bookname
            .split(/[=/:]/)
            .map((item) => `<p>${item}</p>`)
            .join("");
        this.querySelector(".bookname").innerHTML = bookNames;
        this.querySelector(".authors").textContent = authors;
        this.querySelector(".class_nm").textContent = class_nm;
        this.querySelector(".class_no").textContent = class_no;
        this.querySelector(".description").textContent =
            description;
        this.querySelector(".isbn13").textContent = isbn13;
        this.querySelector(".loanCnt").textContent =
            loanCnt.toLocaleString();
        this.querySelector(".publication_year").textContent =
            publication_year;
        this.querySelector(".publisher").textContent =
            publisher;
        const bookImageElement = this.querySelector("book-image");
        if (bookImageElement) {
            bookImageElement.data = {
                bookImageURL,
                bookname,
            };
        }
    }
    renderKeyword(keywords) {
        const keywordsString = keywords
            .map((item) => {
            const url = encodeURI(item.word);
            return `<a href="/search?keyword=${url}"><span>${item.word}</span></a>`;
        })
            .join("");
        this.querySelector(".keyword").innerHTML =
            keywordsString;
    }
    renderCoLeanBooks(coLoanBooks) {
        var _a, _b;
        const template = (_a = document.querySelector("#tp-coLoanBookItem")) === null || _a === void 0 ? void 0 : _a.content.firstElementChild;
        if (!template)
            return;
        const fragment = new DocumentFragment();
        coLoanBooks
            .map((book) => this.createRecItem(template, book))
            .forEach((el) => fragment.appendChild(el));
        (_b = this.querySelector(".coLoanBooks")) === null || _b === void 0 ? void 0 : _b.appendChild(fragment);
    }
    renderManiaBooks(maniaRecBooks) {
        var _a, _b;
        const template = (_a = this.recBookTemplate) === null || _a === void 0 ? void 0 : _a.content.firstElementChild;
        if (!template)
            return;
        const fragment = new DocumentFragment();
        maniaRecBooks
            .map((book) => this.createRecItem(template, book))
            .forEach((el) => fragment.appendChild(el));
        (_b = this.querySelector(".maniaBooks")) === null || _b === void 0 ? void 0 : _b.appendChild(fragment);
    }
    renderReaderBooks(readerRecBooks) {
        var _a, _b;
        const template = (_a = this.recBookTemplate) === null || _a === void 0 ? void 0 : _a.content.firstElementChild;
        if (!template)
            return;
        const fragment = new DocumentFragment();
        readerRecBooks
            .map((book) => this.createRecItem(template, book))
            .forEach((el) => fragment.appendChild(el));
        (_b = this.querySelector(".readerBooks")) === null || _b === void 0 ? void 0 : _b.appendChild(fragment);
    }
    createRecItem(template, book) {
        const el = template.cloneNode(true);
        const { isbn13 } = book;
        for (const [key, value] of Object.entries(book)) {
            const node = el.querySelector(`.${key}`);
            node.textContent = value;
        }
        const link = el.querySelector("a");
        if (link)
            link.href = `book?isbn=${isbn13}`;
        return el;
    }
    renderError() {
        if (this.loadingElement)
            this.loadingElement.textContent = "정보를 가져올 수 없습니다.";
    }
}
//# sourceMappingURL=Book.js.map