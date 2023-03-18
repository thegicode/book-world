export default class BookImage extends HTMLElement {
    constructor() {
        super();
        this.bookData = null;
    }
    set data(objectData) {
        this.bookData = objectData;
        if (!this.querySelector('img')) {
            this.render();
        }
        this.onSetThumb(objectData);
        this.handleError();
    }
    connectedCallback() {
        this.render();
    }
    render() {
        let imageSrc = '';
        let imageAlt = '';
        if (this.bookData) {
            const { bookImageURL, bookname } = this.bookData;
            imageSrc = bookImageURL;
            imageAlt = bookname;
        }
        this.innerHTML = `
            <div class="book-image">
                <img class="thumb" src="${imageSrc}" alt="${imageAlt}"></img>
            </div>`;
        if (this.bookData) {
            this.handleError();
        }
    }
    onSetThumb({ bookImageURL, bookname }) {
        const imgElement = this.querySelector('img');
        if (imgElement) {
            imgElement.src = `${bookImageURL}`;
            imgElement.alt = bookname;
        }
    }
    handleError() {
        const imgElement = this.querySelector('img');
        if (imgElement) {
            imgElement.onerror = () => {
                this.dataset.fail = 'true';
                imgElement.remove();
            };
        }
    }
}
//# sourceMappingURL=BookImage.js.map