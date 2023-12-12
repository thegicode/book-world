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
import renderBookItem from "./renderBooItem";
export default class BookItem extends HTMLElement {
    constructor(data) {
        super();
        this.libraryButton = null;
        this.data = data;
        this.onLibraryButtonClick = this.onLibraryButtonClick.bind(this);
    }
    connectedCallback() {
        this.renderView();
        this.libraryButton = this.querySelector(".library-button");
        this.addListeners();
    }
    disconnectedCallback() {
        this.removeListeners();
    }
    addListeners() {
        var _a;
        (_a = this.libraryButton) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.onLibraryButtonClick);
    }
    removeListeners() {
        var _a;
        (_a = this.libraryButton) === null || _a === void 0 ? void 0 : _a.removeEventListener("click", this.onLibraryButtonClick);
    }
    renderView() {
        const _a = this.data, { discount, pubdate } = _a, others = __rest(_a, ["discount", "pubdate"]);
        const _pubdate = `${pubdate.substring(0, 4)}.${pubdate.substring(4, 6)}.${pubdate.substring(6)}`;
        const renderData = Object.assign(Object.assign({}, others), { discount: Number(discount).toLocaleString(), pubdate: _pubdate });
        renderBookItem(this, renderData);
    }
    // 도서관 소장 | 대출 조회
    onLibraryButtonClick() {
        const isbn = this.dataset.isbn || "";
        const libraryBookExist = this.querySelector("library-book-exist");
        libraryBookExist.onLibraryBookExist(this.libraryButton, isbn, bookModel.getLibraries());
    }
}
//# sourceMappingURL=BookItem.js.map