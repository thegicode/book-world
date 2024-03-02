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
export default function renderFavoriteItems(favoriteItem, _a) {
    var { bookImageURL, bookname, description, isbn13 } = _a, otherData = __rest(_a, ["bookImageURL", "bookname", "description", "isbn13"]);
    const imageNode = favoriteItem.querySelector("book-image");
    imageNode.data = {
        bookImageURL,
        bookname,
    };
    const descNode = favoriteItem.querySelector("book-description");
    descNode.data = description;
    const anchorEl = favoriteItem.querySelector("a");
    anchorEl.href = `/book?isbn=${isbn13}`;
    const others = Object.assign(Object.assign({}, otherData), { bookname,
        isbn13 });
    fillElementsWithData(others, favoriteItem);
    if (favoriteItem.libraryButton &&
        Object.keys(bookModel.getLibraries()).length === 0) {
        favoriteItem.libraryButton.hidden = true;
    }
}
export function errorRender(favoriteItem) {
    favoriteItem.dataset.fail = "true";
    favoriteItem.querySelector(".bookname").textContent = `ISBN : ${favoriteItem.isbn}`;
    favoriteItem.querySelector(".authors").textContent =
        "정보가 없습니다.";
}
export function updateOnLibrary(favoriteItem) {
    if (favoriteItem.libraryButton)
        favoriteItem.libraryButton.hidden = true;
    if (favoriteItem.hideButton) {
        favoriteItem.hideButton.hidden = false;
    }
}
export function updateOnHideLibrary(favoriteItem) {
    if (favoriteItem.libraryButton) {
        favoriteItem.libraryButton.disabled = false;
        favoriteItem.libraryButton.hidden = false;
    }
    if (favoriteItem.hideButton) {
        favoriteItem.hideButton.hidden = true;
    }
}
//# sourceMappingURL=renderFavoirteItem.js.map