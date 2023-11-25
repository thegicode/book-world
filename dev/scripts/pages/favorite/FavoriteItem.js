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
import { CustomFetch } from "../../utils/index";
import { LoadingComponent, } from "../../components/index";
import bookModel from "../../model";
customElements.define("loading-component", LoadingComponent);
export default class FavoriteItem extends HTMLElement {
    constructor() {
        super();
        this.loadingComponent =
            this.querySelector("loading-component");
    }
    connectedCallback() {
        var _a;
        this.libraryButton = this.querySelector(".library-button");
        this.hideButton = this.querySelector(".hide-button");
        this.libraryBookExist = this.querySelector("library-book-exist");
        this.fetchData(this.dataset.isbn);
        this.libraryButton.addEventListener("click", this.onLibrary.bind(this));
        (_a = this.hideButton) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.onHideLibrary.bind(this));
    }
    disconnectedCallback() {
        var _a, _b;
        (_a = this.libraryButton) === null || _a === void 0 ? void 0 : _a.removeEventListener("click", this.onLibrary);
        (_b = this.hideButton) === null || _b === void 0 ? void 0 : _b.removeEventListener("click", this.onHideLibrary);
    }
    fetchData(isbn) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = this.loadingComponent) === null || _a === void 0 ? void 0 : _a.show();
            const url = `/usage-analysis-list?isbn13=${isbn}`;
            try {
                const data = yield CustomFetch.fetch(url);
                this.render(data);
            }
            catch (error) {
                this.errorRender();
                console.error(error);
                throw new Error(`Fail to get usage analysis list.`);
            }
            (_b = this.loadingComponent) === null || _b === void 0 ? void 0 : _b.hide();
        });
    }
    render(data) {
        this.bookData = data;
        const _a = data.book, { bookImageURL } = _a, otherData = __rest(_a, ["bookImageURL"])
        // bookname, isbn13, authors,  class_nm,  class_no, description, loanCnt,  publication_year, publisher,
        ;
        const bookname = data.book.bookname;
        const imageNode = this.querySelector("book-image");
        if (imageNode) {
            imageNode.data = {
                bookImageURL,
                bookname,
            };
        }
        Object.entries(otherData).forEach(([key, value]) => {
            if (key === "description") {
                const descNode = this.querySelector("book-description");
                if (descNode)
                    descNode.data = value;
            }
            else {
                const element = this.querySelector(`.${key}`);
                if (element)
                    element.textContent = value;
            }
        });
        const anchorEl = this.querySelector("a");
        if (anchorEl)
            anchorEl.href = `/book?isbn=${data.book.isbn13}`;
        if (this.libraryButton &&
            Object.keys(bookModel.getLibraries()).length === 0) {
            this.libraryButton.hidden = true;
        }
    }
    errorRender() {
        this.dataset.fail = "true";
        this.querySelector("h4").textContent = `ISBN : ${this.dataset.isbn}`;
        this.querySelector(".authors").textContent =
            "정보가 없습니다.";
    }
    onLibrary() {
        const isbn = this.dataset.isbn;
        if (this.libraryBookExist && this.libraryButton) {
            this.libraryBookExist.onLibraryBookExist(this.libraryButton, isbn, bookModel.getLibraries());
            if (this.libraryButton) {
                this.libraryButton.hidden = true;
            }
            if (this.hideButton) {
                this.hideButton.hidden = false;
            }
        }
    }
    onHideLibrary() {
        var _a;
        const list = (_a = this.libraryBookExist) === null || _a === void 0 ? void 0 : _a.querySelector("ul");
        list.innerHTML = "";
        if (this.libraryButton) {
            this.libraryButton.disabled = false;
            this.libraryButton.hidden = false;
        }
        if (this.hideButton) {
            this.hideButton.hidden = true;
        }
    }
}
//# sourceMappingURL=FavoriteItem.js.map