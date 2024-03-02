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
import { cloneTemplate } from "../../utils/helpers";
import bookModel from "../../model";
export default class LibrarySearchByBook extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.fetch(new URLSearchParams(location.search).get("isbn"));
    }
    fetch(isbn) {
        return __awaiter(this, void 0, void 0, function* () {
            const libries = Object.values(bookModel.regions);
            if (libries.length === 0)
                return;
            const promises = [];
            libries.forEach((region) => {
                Object.values(region).forEach((detailCode) => {
                    promises.push(this.fetchLibrarySearchByBook(isbn, detailCode.slice(0, 2), detailCode));
                });
            });
            yield Promise.all(promises);
        });
    }
    fetchLibrarySearchByBook(isbn, region, dtl_region) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchParams = new URLSearchParams({
                isbn,
                region,
                dtl_region,
            });
            try {
                const data = yield CustomFetch.fetch(`/library-search-by-book?${searchParams}`);
                this.render(data, isbn);
            }
            catch (error) {
                console.error(error);
                throw new Error(`Fail to get library search by book.`);
            }
        });
    }
    render({ libraries }, isbn) {
        if (libraries.length < 1)
            return;
        const listElement = document.createElement("ul");
        const fragment = new DocumentFragment();
        libraries
            .map(({ homepage, libCode, libName }) => this.createLibrarySearchResultItem(isbn, homepage, libCode, libName))
            .forEach((element) => fragment.appendChild(element));
        listElement.appendChild(fragment);
        document.querySelector(".library-search-by-book").appendChild(listElement);
    }
    createLibrarySearchResultItem(isbn, homepage, libCode, libName) {
        const template = document.querySelector("#tp-librarySearchByBookItem");
        if (!template)
            return null;
        const cloned = cloneTemplate(template);
        const link = cloned.querySelector("a");
        cloned.dataset.code = libCode;
        link.textContent = libName;
        link.href = homepage;
        this.loanAvailable(isbn, libCode, cloned);
        return cloned;
    }
    loanAvailable(isbn, libCode, el) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hasBook, loanAvailable } = yield this.fetchLoadnAvailabilty(isbn, libCode);
            const hasBookEl = el.querySelector(".hasBook");
            const isAvailableEl = el.querySelector(".loanAvailable");
            if (hasBookEl) {
                hasBookEl.textContent = hasBook === "Y" ? "소장" : "미소장";
            }
            if (isAvailableEl) {
                const isLoanAvailable = loanAvailable === "Y";
                isAvailableEl.textContent = isLoanAvailable
                    ? "대출 가능"
                    : "대출 불가";
                if (isLoanAvailable) {
                    el.dataset.available = "true";
                }
            }
        });
    }
    fetchLoadnAvailabilty(isbn13, libCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchParams = new URLSearchParams({
                isbn13,
                libCode,
            });
            const url = `/book-exist?${searchParams}`;
            try {
                const result = yield CustomFetch.fetch(url, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                return result;
            }
            catch (error) {
                console.error(error);
                throw new Error(`Fail to get book exist.`);
            }
        });
    }
}
//# sourceMappingURL=LibrarySearchByBook.js.map