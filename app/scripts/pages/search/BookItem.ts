import {
    BookDescription,
    BookImage,
    LibraryBookExist,
} from "../../components/index";
import bookModel from "../../model";

export default class BookItem extends HTMLElement {
    private bookLibraryButton: HTMLButtonElement | null = null;
    bookData!: ISearchBook;

    constructor() {
        super();
        this.initializeEventHandlers();
    }

    connectedCallback() {
        this.populateBookData();
    }

    disconnectedCallback() {
        this.removeEventHandlers();
    }

    private initializeEventHandlers() {
        this.bookLibraryButton = this.querySelector(".library-button");
        this.bookLibraryButton?.addEventListener(
            "click",
            this.onLibraryButtonClick
        );
    }

    private removeEventHandlers() {
        this.bookLibraryButton?.removeEventListener(
            "click",
            this.onLibraryButtonClick
        );
    }

    private populateBookData() {
        if (!this.bookData) {
            console.error("Book data is not provided");
            return;
        }

        this.updateBookElements(this.bookData);
    }

    private updateBookElements(bookData: ISearchBook) {
        const {
            image,
            isbn,
            link,
            pubdate,
            ...otherData // author,  description,  discount,  publisher, title,
        } = bookData;

        const title = bookData.title;

        const imageNode = this.querySelector<BookImage>("book-image");
        if (imageNode) {
            imageNode.dataset.object = JSON.stringify({
                bookImageURL: image,
                bookname: title,
            });
        }

        const linkNode = this.querySelector(".link") as HTMLAnchorElement;
        if (linkNode) linkNode.href = link;

        const date = `${pubdate.substring(0, 4)}.${pubdate.substring(
            4,
            6
        )}.${pubdate.substring(6)}`;
        const pubdateNode = this.querySelector(".pubdate") as HTMLElement;
        if (pubdateNode) pubdateNode.textContent = date;

        Object.entries(otherData).forEach(([key, value]) => {
            if (key === "description") {
                const descNode =
                    this.querySelector<BookDescription>("book-description");
                if (descNode) descNode.data = value as string;
            } else {
                const element = this.querySelector(`.${key}`) as HTMLElement;
                if (element) element.textContent = value as string;
            }
        });

        const anchorEl = this.querySelector("a") as HTMLAnchorElement;
        if (anchorEl) anchorEl.href = `/book?isbn=${isbn}`;

        this.dataset.isbn = isbn;
    }

    private onLibraryButtonClick = () => {
        const isbn = this.dataset.isbn || "";
        const libraryBookNode =
            this.querySelector<LibraryBookExist>("library-book-exist");
        libraryBookNode?.onLibraryBookExist(
            this.bookLibraryButton,
            isbn,
            bookModel.getLibraries()
        );
    };
}
