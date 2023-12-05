import { BookDescription, BookImage } from "../../components";
import { fillElementsWithData } from "../../utils/helpers";
import BookItem from "./BookItem";

export default function renderBookItem(bookItem: BookItem, data: ISearchBook) {
    const {
        description,
        image,
        isbn,
        link,
        title,
        ...otherData // author, discount, pubdate, publisher
    } = data;

    // 썸네일 이미지
    const imageEl = bookItem.querySelector("book-image") as BookImage;
    imageEl.dataset.object = JSON.stringify({
        bookImageURL: image,
        bookname: title,
    });

    // 네이버 바로가기
    const linkEl = bookItem.querySelector(".link") as HTMLAnchorElement;
    linkEl.href = link;

    // description
    const descriptionEl = bookItem.querySelector(
        "book-description"
    ) as BookDescription;
    if (descriptionEl) descriptionEl.data = description as string;

    // 상세화면 이동
    const anchorEl = bookItem.querySelector("a") as HTMLAnchorElement;
    anchorEl.href = `/book?isbn=${isbn}`;

    // element.textContent
    fillElementsWithData({ ...otherData, title }, bookItem);

    bookItem.dataset.isbn = isbn;
}
