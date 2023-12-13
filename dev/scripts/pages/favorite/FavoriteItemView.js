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
import { fillElementsWithData } from "../../utils/helpers";
export default class FavoriteItemView {
    constructor(control) {
        this.control = control;
    }
    render(_a) {
        var { bookImageURL, bookname, description, isbn13 } = _a, otherData = __rest(_a, ["bookImageURL", "bookname", "description", "isbn13"]);
        const imageNode = this.control.querySelector("book-image");
        imageNode.data = {
            bookImageURL,
            bookname,
        };
        const descNode = this.control.querySelector("book-description");
        descNode.data = description;
        const anchorEl = this.control.querySelector("a");
        anchorEl.href = `/book?isbn=${isbn13}`;
        const others = Object.assign(Object.assign({}, otherData), { bookname,
            isbn13 });
        fillElementsWithData(others, this.control);
        if (this.control.libraryButton &&
            Object.keys(bookModel.libraries).length === 0) {
            this.control.libraryButton.hidden = true;
        }
    }
    renderError() {
        this.control.dataset.fail = "true";
        this.control.querySelector(".bookname").textContent = `ISBN : ${this.control.isbn}`;
        this.control.querySelector(".authors").textContent =
            "정보가 없습니다.";
    }
    updateOnLibrary() {
        if (this.control.libraryButton)
            this.control.libraryButton.hidden = true;
        if (this.control.hideButton) {
            this.control.hideButton.hidden = false;
        }
    }
    updateOnHideLibrary() {
        if (this.control.libraryButton) {
            this.control.libraryButton.disabled = false;
            this.control.libraryButton.hidden = false;
        }
        if (this.control.hideButton) {
            this.control.hideButton.hidden = true;
        }
    }
}
//# sourceMappingURL=FavoriteItemView.js.map