import { BookDescription, BookImage } from "../../components";
import bookModel from "../../model";
import { fillElementsWithData } from "../../utils/helpers";
import FavoriteItem from "./FavoriteItem";

export default class FavoriteItemUI {
    private component: FavoriteItem;

    constructor(component: FavoriteItem) {
        this.component = component;
    }

    render({
        bookImageURL,
        bookname,
        description,
        isbn13,
        ...otherData
    }: IBook) {
        const linkElement = this.component.querySelector(
            ".book-summary a"
        ) as HTMLElement;
        linkElement.appendChild(new BookImage(bookImageURL, bookname));

        const descNode = this.component.querySelector(
            "book-description"
        ) as BookDescription;
        descNode.data = description;

        const anchorEl = this.component.querySelector("a") as HTMLAnchorElement;
        anchorEl.href = `/book?isbn=${isbn13}`;

        const others = {
            ...otherData,
            bookname,
            isbn13,
        };
        fillElementsWithData(others, this.component);

        if (
            this.component.libraryButton &&
            Object.keys(bookModel.libraries).length === 0
        ) {
            this.component.libraryButton.hidden = true;
        }
    }

    renderError() {
        this.component.dataset.fail = "true";
        (
            this.component.querySelector(".bookname") as HTMLElement
        ).textContent = `ISBN : ${this.component.isbn}`;
        (this.component.querySelector(".authors") as HTMLElement).textContent =
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
