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
import { fillElementsWithData } from "../../utils/helpers";
export default function renderBookItem(bookItem, data) {
    const { description, image, isbn, link, title } = data, otherData = __rest(data, ["description", "image", "isbn", "link", "title"]) // author, discount, pubdate, publisher
    ;
    // 썸네일 이미지
    const imageEl = bookItem.querySelector("book-image");
    imageEl.dataset.object = JSON.stringify({
        bookImageURL: image,
        bookname: title,
    });
    // 네이버 바로가기
    const linkEl = bookItem.querySelector(".link");
    linkEl.href = link;
    // description
    const descriptionEl = bookItem.querySelector("book-description");
    if (descriptionEl)
        descriptionEl.data = description;
    // 상세화면 이동
    const anchorEl = bookItem.querySelector("a");
    anchorEl.href = `/book?isbn=${isbn}`;
    // element.textContent
    fillElementsWithData(Object.assign(Object.assign({}, otherData), { title }), bookItem);
    bookItem.dataset.isbn = isbn;
}
//# sourceMappingURL=renderBooItem.js.map