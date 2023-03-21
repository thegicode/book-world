import { state } from '../../modules/model.js';
export default class BookItem extends HTMLElement {
    constructor() {
        super();
        this.render();
    }
    connectedCallback() {
        this.libraryButton = this.querySelector('.library-button');
        this.link = this.querySelector('.book-summary');
        this.render();
        this.libraryButton.addEventListener('click', this.onClickLibraryButton.bind(this));
        this.link.addEventListener('click', this.onClickLink.bind(this));
    }
    disconnectedCallback() {
        this.libraryButton.removeEventListener('click', this.onClickLibraryButton);
        this.link.removeEventListener('click', this.onClickLink);
    }
    render() {
        const { author, description, image, isbn, link, pubdate, publisher, title,
        // discount,
        // price,
         } = this.data;
        const formattedPubdate = `${pubdate.substring(0, 4)}.${pubdate.substring(4, 6)}.${pubdate.substring(6)}`;
        const titleEl = this.querySelector('.title');
        if (titleEl)
            titleEl.textContent = title;
        const pubEl = this.querySelector('.publisher');
        if (pubEl)
            pubEl.textContent = publisher;
        const authorEl = this.querySelector('.author');
        if (authorEl)
            authorEl.textContent = author;
        const pubdateEl = this.querySelector('.pubdate');
        if (pubdateEl)
            pubdateEl.textContent = formattedPubdate;
        const isbnEl = this.querySelector('.isbn');
        if (isbnEl)
            isbnEl.textContent = `isbn : ${isbn.split(' ').join(', ')}`;
        const bookDespEl = this.querySelector('book-description');
        if (bookDespEl)
            bookDespEl.data = description;
        const linkEl = this.querySelector('.__link');
        if (linkEl)
            linkEl.href = link;
        const bookImageEl = this.querySelector('book-image');
        if (bookImageEl)
            bookImageEl.dataset.object = JSON.stringify({
                bookImageURL: image,
                bookname: title
            });
        this.dataset.index = this.index.toString();
        this.dataset.isbn = isbn;
    }
    onClickLibraryButton() {
        const isbn = this.dataset.isbn || '';
        const libraryBookExist = this.querySelector('library-book-exist');
        if (libraryBookExist) {
            libraryBookExist.onLibraryBookExist(this.libraryButton, isbn, state.libraries);
        }
    }
    onClickLink(event) {
        event.preventDefault();
        location.href = `book?isbn=${this.dataset.isbn}`;
    }
}
// const mm = (pubdate.length === 7) ? `0${pubdate.substring(4, 5)}` : pubdate.substring(4, 6)
// const dd = pubdate.substring(pubdate.length - 2, pubdate.length)
// const obj = {
//     title: `${title}`,
//     author: `${author}`,
//     description: `${description}`,
//     // price: `${Number(price).toLocaleString()}원`,
//     publisher: `${publisher}`,
//     pubdate: `${formattedPubdate}`,
//     isbn: `isbn : ${isbn.split(' ').join(', ')}`
// }
// for (const [key, value] of Object.entries(obj)) {
//     this.querySelector(`.${key}`).innerHTML = value
// }
//# sourceMappingURL=BookItem.js.map