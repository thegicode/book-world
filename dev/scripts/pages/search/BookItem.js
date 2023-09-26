import { state } from "../../modules/model";
export default class BookItem extends HTMLElement {
    constructor() {
        super();
        this.boundClickLibraryHandler = null;
        // this.render(); why?
    }
    connectedCallback() {
        this.render();
        this.libraryButton = this.querySelector(BookItem.SELECTORS.libraryButton);
        this.boundClickLibraryHandler = this.onClickLibraryButton.bind(this);
        this.libraryButton.addEventListener("click", this.boundClickLibraryHandler);
    }
    disconnectedCallback() {
        if (this.boundClickLibraryHandler) {
            this.libraryButton.removeEventListener("click", this.boundClickLibraryHandler);
        }
    }
    render() {
        if (!this.bookData) {
            console.error("Book data is not provided");
            return;
        }
        const formattedData = this.getFormattedData(this.bookData);
        this.updateDOMElements(formattedData);
    }
    getFormattedData(bookData) {
        const { author, description, image, isbn, link, pubdate, publisher, title,
        // discount,
        // price,
         } = bookData;
        const formattedPubdate = `${pubdate.substring(0, 4)}.${pubdate.substring(4, 6)}.${pubdate.substring(6)}`;
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
    updateDOMElements(formattedData) {
        const { author, description, image, isbn, link, pubdate, publisher, title, } = formattedData;
        const selelctors = BookItem.SELECTORS;
        const titleEl = this.querySelector(selelctors.title);
        if (titleEl)
            titleEl.textContent = title;
        const pubEl = this.querySelector(selelctors.publisher);
        if (pubEl)
            pubEl.textContent = publisher;
        const authorEl = this.querySelector(selelctors.author);
        if (authorEl)
            authorEl.textContent = author;
        const pubdateEl = this.querySelector(selelctors.pubdate);
        if (pubdateEl)
            pubdateEl.textContent = pubdate;
        const isbnEl = this.querySelector(selelctors.isbn);
        if (isbnEl)
            isbnEl.textContent = `isbn : ${isbn.split(" ").join(", ")}`;
        const bookDespEl = this.querySelector(selelctors.bookDescription);
        if (bookDespEl)
            bookDespEl.data = description;
        const linkEl = this.querySelector(selelctors.link);
        if (linkEl)
            linkEl.href = link;
        const bookImageEl = this.querySelector(selelctors.bookImage);
        if (bookImageEl)
            bookImageEl.dataset.object = JSON.stringify({
                bookImageURL: image,
                bookname: title,
            });
        const anchorElement = this.querySelector("a");
        if (anchorElement) {
            anchorElement.href = `./book?isbn=${isbn}`;
        }
        // this.dataset.index = this.index.toString();
        this.dataset.isbn = isbn;
    }
    onClickLibraryButton() {
        const isbn = this.dataset.isbn || "";
        const libraryBookExist = this.querySelector(BookItem.SELECTORS.libraryBookExist);
        if (libraryBookExist) {
            libraryBookExist.onLibraryBookExist(this.libraryButton, isbn, state.libraries);
        }
    }
}
BookItem.SELECTORS = {
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
//# sourceMappingURL=BookItem.js.map