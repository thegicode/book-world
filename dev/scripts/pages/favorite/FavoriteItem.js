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
import { state } from "../../modules/model";
export default class FavoriteItem extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        var _a;
        this.libraryButton = this.querySelector(".library-button");
        this.hideButton = this.querySelector(".hide-button");
        this.libraryBookExist = this.querySelector("library-book-exist");
        this.loading();
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
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    render(data) {
        const { book,
        // loanHistory,
        // loanGrps,
        // keywords,
        // recBooks,
        // coLoanBooks
         } = data;
        const { authors, bookImageURL, bookname, class_nm, 
        // class_no,
        description, isbn13, loanCnt, publication_year, publisher,
        // vol
         } = book;
        this.bookData = data;
        this.querySelector(".bookname").textContent = bookname;
        this.querySelector(".authors").textContent = authors;
        const classNm = this.querySelector(".class_nm");
        if (class_nm === " >  > ") {
            classNm.remove();
        }
        else {
            classNm.textContent = class_nm;
        }
        this.querySelector(".isbn13").textContent = isbn13;
        this.querySelector(".loanCnt").textContent =
            loanCnt.toLocaleString();
        this.querySelector(".publication_year").textContent =
            publication_year;
        this.querySelector(".publisher").textContent =
            publisher;
        const descriptionElement = this.querySelector("book-description");
        if (descriptionElement) {
            descriptionElement.data = description;
        }
        const imageElement = this.querySelector("book-image");
        if (imageElement) {
            imageElement.data = {
                bookImageURL,
                bookname,
            };
        }
        this.querySelector("a").href = `./book?isbn=${isbn13}`;
        if (this.libraryButton && Object.keys(state.libraries).length === 0) {
            this.libraryButton.hidden = true;
        }
        this.removeLoading();
    }
    errorRender() {
        this.removeLoading();
        this.dataset.fail = "true";
        this.querySelector("h4").textContent = `ISBN : ${this.dataset.isbn}`;
        this.querySelector(".authors").textContent =
            "정보가 없습니다.";
    }
    onLibrary() {
        const isbn = this.dataset.isbn;
        if (this.libraryBookExist && this.libraryButton) {
            this.libraryBookExist.onLibraryBookExist(this.libraryButton, isbn, state.libraries);
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
    loading() {
        this.dataset.loading = "true";
    }
    removeLoading() {
        delete this.dataset.loading;
    }
}
//# sourceMappingURL=FavoriteItem.js.map