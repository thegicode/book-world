
export default class BookImage extends HTMLElement {
    private bookData: { bookImageURL: string, bookname: string } | null

    constructor() {
        super()
        this.bookData = null
    }

    set data(objectData: { bookImageURL: string, bookname: string }) {
        this.bookData = objectData
        if (!this.querySelector('img')) {
            this.render()
        }
        this.onSetThumb(objectData)
        this.handleError()
    }

    connectedCallback(): void {
        this.render()
    }

    private render(): void {
        let imageSrc = ''
        let imageAlt = ''
        if (this.bookData) {
            const { bookImageURL, bookname } = this.bookData
            imageSrc = bookImageURL
            imageAlt = bookname
        }

        this.innerHTML = `
            <div class="book-image">
                <img class="thumb" src="${imageSrc}" alt="${imageAlt}"></img>
            </div>`
        
        if (this.bookData) {
            this.handleError()
        }
    }

    private onSetThumb({ bookImageURL, bookname }: { bookImageURL: string; bookname: string }): void {
        const imgElement = this.querySelector('img')
        if (imgElement) {
            imgElement.src = `${bookImageURL}`
            imgElement.alt = bookname
        }
    }

    handleError(): void {
        const imgElement = this.querySelector('img')
        if (imgElement) {
            imgElement.onerror = () => {
                this.dataset.fail = 'true'
                imgElement.remove()
            }
        }
    }
    
}