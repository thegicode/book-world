
import { state, addFavorite, deleteFavorite, includesFavorite } from '../../modules/model.js'

export default class BookItem extends HTMLElement {
    constructor() {
        super()
        this.favoriteButton = this.querySelector('input[name="favorite"]')
        this.libraryButton = this.querySelector('.library-button')
        this.libraryBookExist = this.querySelector('library-book-exist')
        this.link = this.querySelector('.book-info')
    }

    connectedCallback() {
        this.render()

        this.favoriteButton.addEventListener('change', this.onFavorite.bind(this))
        this.libraryButton.addEventListener('click', this.onClickLibraryButton.bind(this))
        this.link.addEventListener('click', this.onClickLink.bind(this))
    }

    disconnectedCallback() {
        this.favoriteButton.removeEventListener('change', this.onFavorite.bind(this))
        this.libraryButton.removeEventListener('click', this.onClickLibraryButton.bind(this))
        this.link.removeEventListener('click', this.onClickLink.bind(this))
    }

    render() {
        const { author,
            description,
            discount,
            image,
            isbn,
            link,
            // price,
            pubdate,
            publisher,
            title } = this.data

        const yyyy = pubdate.substring(0,4)
        const dd = pubdate.substring(pubdate.length - 2, pubdate.length)
        const mm = (pubdate.length === 7) ? `0${pubdate.substring(4, 5)}` : pubdate.substring(4, 6)
        const _date = `${yyyy}.${mm}.${dd}`

        const obj = {
            title: `${title}`,
            author: `${author}`,
            description: `${description}`,
            // price: `${Number(price).toLocaleString()}원`,
            publisher: `${publisher}`,
            pubdate: `${_date}`,
            isbn: `isbn : ${isbn.split(' ').join(', ')}`
        }
        for (const [key, value] of Object.entries(obj)) {
            this.querySelector(`.${key}`).innerHTML = value
        }

        this.querySelector('.__link').href = link

        const img = this.querySelector('img')
        img.src = image
        img.onerror = () => {
            this.querySelector('.thumb').dataset.fail = true
            console.error('image fail', image)
            img.remove()
        }

        this.dataset.index = this.index
        this.isbn13 = isbn.split(' ')[0]

        // const { favorite } = state
        if (includesFavorite(this.isbn13)) {
            this.favoriteButton.checked = true
        }
        
    }

    onFavorite(event) {
        const { checked } = event.target
        if (checked) {
            addFavorite(this.isbn13)
        } else {
            deleteFavorite(this.isbn13)
        }
    }

    onClickLibraryButton() {
        this.libraryBookExist
            .onLibraryBookExist(this.libraryButton, this.isbn13, state.library)

    }
    
    onClickLink(event) {
        event.preventDefault()
        location.href = `book?isbn=${this.isbn13}`
    }

}

