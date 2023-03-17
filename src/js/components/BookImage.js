
export default class BookImage extends HTMLElement {
    constructor() {
        super()
    }

    set data(data) {
        if (!this.querySelector('img')) {
            this.render()
        }
        this.onSetThumb(data)
        this.handleError()
    }

    connectedCallback() {
        this.render()
    }

    render() {
        let imageSrc = ''
        let imageAlt = ''
        if (this.data) {
            const { bookImageURL, bookname } = this.data
            imageSrc = bookImageURL
            imageAlt = bookname
        }

        this.innerHTML = `
            <div class="book-image">
                <img class="thumb" src="${imageSrc}" alt="${imageAlt}"></img>
            </div>`
        
        if (this.data) {
            this.handleError()
        }
    }

    onSetThumb({ bookImageURL, bookname }) {
        const imgElement = this.querySelector('img')
        imgElement.src = `${bookImageURL}`
        imgElement.alt = bookname
    }

    handleError() {
        const imgElement = this.querySelector('img')
        imgElement.onerror = () => {
            this.dataset.fail = true
            imgElement.remove()
        }
    }
    
}