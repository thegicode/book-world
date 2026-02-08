import {
    BookDescription,
    BookImage,
    LibraryBookExist,
} from "../../components/index";
import bookModel from "../../model";
import { fillElementsWithData } from "../../utils/helpers";
import BaseItemComponent from "../../components/BaseItemComponent";

export default class BookItem extends BaseItemComponent {
    private data: ISearchBook;
    private libraryButton: HTMLButtonElement | null = null;
    private libraryBookExist: LibraryBookExist | null = null;

    constructor(data: ISearchBook) {
        super('/html/templates/book-item.html');
        this.data = data;
        this.onLibraryButtonClick = this.onLibraryButtonClick.bind(this);
    }

    protected onMount() {
        this.renderView();

        this.libraryButton = this.querySelector(".library-button");
        this.libraryBookExist = this.querySelector("library-book-exist");

        this.libraryButton?.addEventListener("click", this.onLibraryButtonClick);
    }

    disconnectedCallback() {
        this.libraryButton?.removeEventListener(
            "click",
            this.onLibraryButtonClick
        );
    }

    private renderView() {
        const { discount, pubdate, isbn, ...others } = this.data;

        const renderData = {
            ...others,
            isbn,
            discount: Number(discount).toLocaleString(),
            pubdate: this.getPubdate(pubdate),
        };

        this.dataset.isbn = isbn;
        this.renderContents(renderData);
    }

    private getPubdate(pubdate: string) {
        return `${pubdate.substring(0, 4)}.${pubdate.substring(
            4,
            6
        )}.${pubdate.substring(6)}`;
    }

    private onLibraryButtonClick() {
        if (!this.libraryBookExist) return;
        this.libraryBookExist.onLibraryBookExist(
            this.libraryButton,
            this.dataset.isbn || "",
            bookModel.libraries
        );
    }

    private renderContents(data: ISearchBook) {
        const { description, image, isbn, link, title, ...otherData } = data;

        // Set the link for the book detail page
        const detailLink = `/book?isbn=${isbn}`;
        const summaryLinkElement = this.querySelector(
            ".book-summary a"
        ) as HTMLAnchorElement;
        if (summaryLinkElement) {
            summaryLinkElement.href = detailLink;
            const bookImage = new BookImage(image, title);
            summaryLinkElement.appendChild(bookImage);
        }

        // Set the link for Naver books
        const naverLinkEl = this.querySelector(".link") as HTMLAnchorElement;
        if (naverLinkEl) naverLinkEl.href = link;

        // Set the description
        const descriptionEl = this.querySelector(
            "book-description"
        ) as BookDescription;
        if (descriptionEl) descriptionEl.data = description as string;

        // Fill in the rest of the data
        fillElementsWithData({ ...otherData, title, isbn }, this);
    }
}