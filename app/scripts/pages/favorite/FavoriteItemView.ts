import { BookDescription, BookImage } from "../../components";
import bookModel from "../../model";
import { fillElementsWithData } from "../../utils/helpers";
import FavoriteItem from "./FavoriteItem";

export default class FavoriteItemView {
    private control: FavoriteItem;

    constructor(control: FavoriteItem) {
        this.control = control;
    }

    render({
        bookImageURL,
        bookname,
        description,
        isbn13,
        ...otherData
    }: IBook) {
        const imageNode = this.control.querySelector("book-image") as BookImage;
        imageNode.data = {
            bookImageURL,
            bookname,
        };

        const descNode = this.control.querySelector(
            "book-description"
        ) as BookDescription;
        descNode.data = description;

        const anchorEl = this.control.querySelector("a") as HTMLAnchorElement;
        anchorEl.href = `/book?isbn=${isbn13}`;

        const others = {
            ...otherData,
            bookname,
            isbn13,
        };
        fillElementsWithData(others, this.control);

        if (
            this.control.libraryButton &&
            Object.keys(bookModel.getLibraries()).length === 0
        ) {
            this.control.libraryButton.hidden = true;
        }
    }

    renderError() {
        this.control.dataset.fail = "true";
        (
            this.control.querySelector(".bookname") as HTMLElement
        ).textContent = `ISBN : ${this.control.isbn}`;
        (this.control.querySelector(".authors") as HTMLElement).textContent =
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
