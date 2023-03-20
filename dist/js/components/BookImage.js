export default class BookImage extends HTMLElement {
    constructor() {
        super();
        this.bookData = null;
    }
    // 즐겨찾기, 상세
    set data(objectData) {
        console.log('set', this.querySelector('img'));
        this.bookData = objectData;
        if (!this.querySelector('img')) {
            this.render();
        }
        else {
            // this.onSetThumb(objectData)
            this.handleError();
        }
    }
    connectedCallback() {
        this.render();
    }
    // searc : dataset
    render() {
        console.log('render');
        const data = this.bookData || JSON.parse(this.dataset.object);
        const { bookImageURL, bookname } = data;
        let imageSrc = '';
        let imageAlt = '';
        if (data) {
            imageSrc = bookImageURL;
            imageAlt = bookname;
        }
        this.innerHTML = `
            <div class="book-image">
                <img class="thumb" src="${imageSrc}" alt="${imageAlt}"></img>
            </div>`;
        if (this.querySelector('img')) {
            this.handleError();
        }
    }
    onSetThumb({ bookImageURL, bookname }) {
        console.log('onSetThumb', this);
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