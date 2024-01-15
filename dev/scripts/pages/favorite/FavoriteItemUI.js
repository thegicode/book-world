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
import { BookImage } from "../../components";
import bookModel from "../../model";
import { fillElementsWithData } from "../../utils/helpers";
export default class FavoriteItemUI {
    constructor(component) {
        this.component = component;
    }
    render(_a) {
        var { bookImageURL, bookname, description, isbn13 } = _a, otherData = __rest(_a, ["bookImageURL", "bookname", "description", "isbn13"]);
        const linkElement = this.component.querySelector(".book-summary a");
        linkElement.appendChild(new BookImage(bookImageURL, bookname));
        const descNode = this.component.querySelector("book-description");
        descNode.data = description;
        const anchorEl = this.component.querySelector("a");
        anchorEl.href = `/book?isbn=${isbn13}`;
        const others = Object.assign(Object.assign({}, otherData), { bookname,
            isbn13 });
        fillElementsWithData(others, this.component);
        if (this.component.libraryButton &&
            Object.keys(bookModel.libraries).length === 0) {
            this.component.libraryButton.hidden = true;
        }
    }
    renderError() {
        this.component.dataset.fail = "true";
        this.component.querySelector(".bookname").textContent = `ISBN : ${this.component.isbn}`;
        this.component.querySelector(".authors").textContent =
            "정보가 없습니다.";
    }
    updateOnLibrary() {
        if (this.component.libraryButton)
            this.component.libraryButton.hidden = true;
        if (this.component.hideButton) {
            this.component.hideButton.hidden = false;
        }
    }
    updateOnHideLibrary() {
        if (this.component.libraryButton) {
            this.component.libraryButton.disabled = false;
            this.component.libraryButton.hidden = false;
        }
        if (this.component.hideButton) {
            this.component.hideButton.hidden = true;
        }
    }
}
//# sourceMappingURL=FavoriteItemUI.js.map