import { state } from "../../modules/model";
import {
    BookDescription,
    BookImage,
    LibraryBookExist,
} from "../../components/index.js";

export default class BookItem extends HTMLElement {
    private static SELECTORS = {
        title: ".title",
        publisher: ".publisher",
        author: ".author",
        pubdate: ".pubdate",
        isbn: ".isbn",
        bookDescription: "book-description",
        link: ".__link",
        bookImage: "book-image",
        libraryBookExist: "library-book-exist",
        libraryButton: ".library-button",
        bookSummary: ".book-summary",
    };

    private libraryButton!: HTMLButtonElement;
    bookData!: ISearchBook;

    private boundClickLibraryHandler:
        | ((this: HTMLElement, ev: MouseEvent) => void)
        | null = null;

    constructor() {
        super();

        // this.render(); why?
    }

    connectedCallback() {
        this.render();

        this.libraryButton = this.querySelector(
            BookItem.SELECTORS.libraryButton
        ) as HTMLButtonElement;

        this.boundClickLibraryHandler = this.onClickLibraryButton.bind(this);

        this.libraryButton.addEventListener(
            "click",
            this.boundClickLibraryHandler
        );
    }

    disconnectedCallback() {
        if (this.boundClickLibraryHandler) {
            this.libraryButton.removeEventListener(
                "click",
                this.boundClickLibraryHandler
            );
        }
    }

    private render() {
        if (!this.bookData) {
            console.error("Book data is not provided");
            return;
        }

        const formattedData = this.getFormattedData(this.bookData);
        this.updateDOMElements(formattedData);
    }

    private getFormattedData(bookData: ISearchBook) {
        const {
            author,
            description,
            image,
            isbn,
            link,
            pubdate,
            publisher,
            title,
            // discount,
            // price,
        } = bookData;

        const formattedPubdate = `${pubdate.substring(
            0,
            4
        )}.${pubdate.substring(4, 6)}.${pubdate.substring(6)}`;

        return {
            author,
            description,
            image,
            isbn,
            link,
            pubdate: formattedPubdate,
            publisher,
            title,
        };
    }

    private updateDOMElements(
        formattedData: ReturnType<typeof this.getFormattedData>
    ) {
        const {
            author,
            description,
            image,
            isbn,
            link,
            pubdate,
            publisher,
            title,
        } = formattedData;

        const selelctors = BookItem.SELECTORS;

        const titleEl = this.querySelector(selelctors.title);
        if (titleEl) titleEl.textContent = title;

        const pubEl = this.querySelector(selelctors.publisher);
        if (pubEl) pubEl.textContent = publisher;

        const authorEl = this.querySelector(selelctors.author);
        if (authorEl) authorEl.textContent = author;

        const pubdateEl = this.querySelector(selelctors.pubdate);
        if (pubdateEl) pubdateEl.textContent = pubdate;

        const isbnEl = this.querySelector(selelctors.isbn);
        if (isbnEl) isbnEl.textContent = `isbn : ${isbn.split(" ").join(", ")}`;

        const bookDespEl = this.querySelector<BookDescription>(
            selelctors.bookDescription
        );
        if (bookDespEl) bookDespEl.data = description;

        const linkEl = this.querySelector(selelctors.link) as HTMLAnchorElement;
        if (linkEl) linkEl.href = link;

        const bookImageEl = this.querySelector<BookImage>(selelctors.bookImage);
        if (bookImageEl)
            bookImageEl.dataset.object = JSON.stringify({
                bookImageURL: image,
                bookname: title,
            });

        const anchorElement = this.querySelector("a") as HTMLAnchorElement;
        if (anchorElement) {
            anchorElement.href = `./book?isbn=${isbn}`;
        }

        // this.dataset.index = this.index.toString();
        this.dataset.isbn = isbn;
    }

    private onClickLibraryButton() {
        const isbn = this.dataset.isbn || "";
        const libraryBookExist = this.querySelector<LibraryBookExist>(
            BookItem.SELECTORS.libraryBookExist
        );
        if (libraryBookExist) {
            libraryBookExist.onLibraryBookExist(
                this.libraryButton,
                isbn,
                state.libraries
            );
        }
    }
}
