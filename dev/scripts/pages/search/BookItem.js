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
import bookModel from "../../model";
export default class BookItem extends HTMLElement {
    constructor() {
        super();
        this.bookLibraryButton = null;
        this.onLibraryButtonClick = () => {
            const isbn = this.dataset.isbn || "";
            const libraryBookNode = this.querySelector("library-book-exist");
            libraryBookNode === null || libraryBookNode === void 0 ? void 0 : libraryBookNode.onLibraryBookExist(this.bookLibraryButton, isbn, bookModel.getLibraries());
        };
    }
    connectedCallback() {
        var _a;
        this.bookLibraryButton = this.querySelector(".library-button");
        (_a = this.bookLibraryButton) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.onLibraryButtonClick);
        this.populateBookData();
    }
    disconnectedCallback() {
        var _a;
        this.bookLibraryButton = this.querySelector(".library-button");
        (_a = this.bookLibraryButton) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.onLibraryButtonClick);
    }
    populateBookData() {
        if (!this.bookData) {
            console.error("Book data is not provided");
            return;
        }
        this.updateBookElements(this.bookData);
    }
    updateBookElements(bookData) {
        const { image, isbn, link, pubdate } = bookData, otherData = __rest(bookData, ["image", "isbn", "link", "pubdate"]) // author,  description,  discount,  publisher, title,
        ;
        const title = bookData.title;
        const imageNode = this.querySelector("book-image");
        if (imageNode) {
            imageNode.dataset.object = JSON.stringify({
                bookImageURL: image,
                bookname: title,
            });
        }
        const linkNode = this.querySelector(".link");
        if (linkNode)
            linkNode.href = link;
        const date = `${pubdate.substring(0, 4)}.${pubdate.substring(4, 6)}.${pubdate.substring(6)}`;
        const pubdateNode = this.querySelector(".pubdate");
        if (pubdateNode)
            pubdateNode.textContent = date;
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
            anchorEl.href = `/book?isbn=${isbn}`;
        this.dataset.isbn = isbn;
    }
}
//# sourceMappingURL=BookItem.js.map