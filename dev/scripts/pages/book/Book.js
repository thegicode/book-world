var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { BookImage } from "../../components/index";
import { CustomFetch } from "../../utils/index";
import { cloneTemplate, fillElementsWithData } from "../../utils/helpers";
export default class Book extends HTMLElement {
    constructor() {
        super();
        this.loadingElement = null;
        this.data = null;
    }
    connectedCallback() {
        this.loadingElement = this.querySelector(".loading");
        const isbn = new URLSearchParams(location.search).get("isbn");
        this.dataset.isbn = isbn;
        this.fetchUsageAnalysisList(isbn).then(() => {
            this.render();
        });
    }
    fetchUsageAnalysisList(isbn) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield CustomFetch.fetch(`/usage-analysis-list?isbn13=${isbn}`);
                this.data = data;
            }
            catch (error) {
                this.renderError();
                console.error(error);
                throw new Error(`Fail to get usage analysis list.`);
            }
        });
    }
    render() {
        var _a;
        if (!this.data) {
            console.error("Data is null");
            return;
        }
        const { book, keywords, coLoanBooks, loanHistory, loanGrps, maniaRecBooks, readerRecBooks, } = this.data;
        this.renderBook(book);
        this.renderLoanHistory(loanHistory);
        this.renderLoanGroups(loanGrps);
        this.renderKeyword(keywords);
        this.renderRecBooks(".coLoanBooks", coLoanBooks, "#tp-coLoanBookItem");
        this.renderRecBooks(".maniaBooks", maniaRecBooks, "#tp-recBookItem");
        this.renderRecBooks(".readerBooks", readerRecBooks, "#tp-recBookItem");
        (_a = this.loadingElement) === null || _a === void 0 ? void 0 : _a.remove();
        this.loadingElement = null;
    }
    renderBook(book) {
        const { bookname, bookImageURL, description } = book, otherData = __rest(book, ["bookname", "bookImageURL", "description"])
        // authors, class_nm,  class_no, description, isbn13,  loanCnt, publication_year,  publisher,
        ;
        const bookNames = bookname
            .split(/[=/:]/)
            .map((item) => `<p>${item}</p>`)
            .join("");
        this.querySelector(".bookname").innerHTML = bookNames;
        this.querySelector(".description").innerHTML =
            description;
        // const bookImageElement = this.querySelector<BookImage>("book-image");
        // if (!bookImageElement) return;
        // bookImageElement.data = {
        //     bookImageURL,
        //     bookname,
        // };
        const bookImage = new BookImage(bookImageURL, bookname);
        const bookImageContainer = this.querySelector(".book-image-container");
        bookImageContainer.appendChild(bookImage);
        fillElementsWithData(otherData, this);
    }
    renderLoanHistory(loanHistory) {
        const fragment = new DocumentFragment();
        loanHistory.forEach((history) => {
            const cloned = cloneTemplate(this.querySelector("#tp-loanHistoryItem"));
            fillElementsWithData(history, cloned);
            fragment.appendChild(cloned);
        });
        this.querySelector(".loanHistory tbody").appendChild(fragment);
    }
    renderLoanGroups(loanGrps) {
        const template = document.querySelector("#tp-loanGrpItem");
        if (!template)
            return;
        const fragment = new DocumentFragment();
        loanGrps.forEach((loanGrp) => {
            const clone = cloneTemplate(template);
            fillElementsWithData(loanGrp, clone);
            fragment.appendChild(clone);
        });
        this.querySelector(".loanGrps tbody").appendChild(fragment);
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
    renderRecBooks(selector, books, template) {
        const container = this.querySelector(selector);
        const tmpl = document.querySelector(template);
        if (!container || !tmpl) {
            console.error("Container or template not found");
            return;
        }
        const fragment = document.createDocumentFragment();
        books
            .map((book) => this.createRecItem(tmpl, book))
            .forEach((item) => fragment.appendChild(item));
        container.appendChild(fragment);
    }
    createRecItem(template, book) {
        const element = cloneTemplate(template);
        const { isbn13 } = book;
        fillElementsWithData(book, element);
        const link = element.querySelector("a");
        if (link)
            link.href = `book?isbn=${isbn13}`;
        return element;
    }
    renderError() {
        if (this.loadingElement)
            this.loadingElement.textContent = "정보를 가져올 수 없습니다.";
    }
}
//# sourceMappingURL=Book.js.map