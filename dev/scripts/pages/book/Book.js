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
        this.loadingElement = this.querySelector(".loading");
        this.data = null;
    }
    connectedCallback() {
        const isbn = new URLSearchParams(location.search).get("isbn");
        this.dataset.isbn = isbn;
        this.fetchUsageAnalysisList(isbn);
    }
    fetchUsageAnalysisList(isbn) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield CustomFetch.fetch(`/usage-analysis-list?isbn13=${isbn}`);
                this.data = data;
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
        const { book: { bookname, authors, bookImageURL, class_nm, class_no, description, isbn13, loanCnt, publication_year, publisher, }, keywords, recBooks, } = this.data; // coLoanBooks, loanGrps,loanHistory,
        const bookNames = bookname
            .split(/[=/:]/)
            .map((item) => `<p>${item}</p>`)
            .join("");
        const keywordsString = keywords
            .map((item) => `<span>${item.word}</span>`)
            .join("");
        const recBooksString = recBooks
            .map(({ bookname, isbn13 }) => `<li><a href=book?isbn=${isbn13}>${bookname}</a></li>`)
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
        this.querySelector(".keyword").innerHTML =
            keywordsString;
        this.querySelector(".recBooks").innerHTML =
            recBooksString;
        const bookImageElement = this.querySelector("book-image");
        if (bookImageElement) {
            bookImageElement.data = {
                bookImageURL,
                bookname,
            };
        }
        this.loadingElement.remove();
    }
    renderError() {
        this.loadingElement.textContent = "정보를 가져올 수 없습니다.";
    }
}
//# sourceMappingURL=Book.js.map