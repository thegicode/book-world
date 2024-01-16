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
        this.libraryBookExist = null;
        this.data = data;
        this.onLibraryButtonClick = this.onLibraryButtonClick.bind(this);
    }
    connectedCallback() {
        this.renderView();
        this.libraryButton = this.querySelector(".library-button");
        this.libraryBookExist = this.querySelector("library-book-exist");
        this.libraryButton.addEventListener("click", this.onLibraryButtonClick);
    }
    disconnectedCallback() {
        var _a;
        (_a = this.libraryButton) === null || _a === void 0 ? void 0 : _a.removeEventListener("click", this.onLibraryButtonClick);
    }
    renderView() {
        const _a = this.data, { discount, pubdate } = _a, others = __rest(_a, ["discount", "pubdate"]);
        const renderData = Object.assign(Object.assign({}, others), { discount: Number(discount).toLocaleString(), pubdate: this.getPubdate(pubdate) });
        renderBookItem(this, renderData);
    }
    getPubdate(pubdate) {
        return `${pubdate.substring(0, 4)}.${pubdate.substring(4, 6)}.${pubdate.substring(6)}`;
    }
    // 도서관 소장 | 대출 조회
    onLibraryButtonClick() {
        var _a;
        (_a = this.libraryBookExist) === null || _a === void 0 ? void 0 : _a.onLibraryBookExist(this.libraryButton, this.dataset.isbn || "", bookModel.libraries);
    }
}
//# sourceMappingURL=BookItem.js.map