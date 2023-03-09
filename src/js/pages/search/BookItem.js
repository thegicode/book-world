
import { state, addFavoriteBook, removeFavoriteBook, isFavoriteBook } from '../../modules/model.js'

export default class BookItem extends HTMLElement {

    favoriteButton
    libraryButton
    libraryBookExist
    link

    constructor() {
        super()
    }

    connectedCallback() {
        this.favoriteButton = this.querySelector('input[name="favorite"]')
        this.libraryButton = this.querySelector('.library-button')
        this.libraryBookExist = this.querySelector('library-book-exist')
        this.link = this.querySelector('.book-summary')

        this.render()

        this.favoriteButton.addEventListener('change', this.onFavorite.bind(this))
        this.libraryButton.addEventListener('click', this.onClickLibraryButton.bind(this))
        this.link.addEventListener('click', this.onClickLink.bind(this))
    }

    disconnectedCallback() {
        this.favoriteButton.removeEventListener('change', this.onFavorite)
        this.libraryButton.removeEventListener('click', this.onClickLibraryButton)
        this.link.removeEventListener('click', this.onClickLink)
    }

    render() {
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
        } = this.data

        const thumbnail = this.querySelector('img')
        thumbnail.src = image
        thumbnail.addEventListener('error', () => {
            this.querySelector('.thumb').dataset.fail = true
            console.error('image fail', thumbnail.src)
            thumbnail.remove()
        })

        const formattedPubdate = `${pubdate.substring(0,4)}.${pubdate.substring(4,6)}.${pubdate.substring(6)}`
        this.querySelector('.title').textContent = title
        this.querySelector('.publisher').textContent = publisher
        this.querySelector('.author').textContent = author
        this.querySelector('.pubdate').textContent = formattedPubdate
        this.querySelector('.isbn').textContent = `isbn : ${isbn.split(' ').join(', ')}`
        this.querySelector('.description').textContent = description
        this.querySelector('.__link').href = link

        this.dataset.index = this.index
        this.isbn13 = isbn.split(' ')[0]

        if (isFavoriteBook(this.isbn13)) {
            this.favoriteButton.checked = true
        }
    }

    onFavorite(event) {
        const { checked } = event.target
        if (checked) {
            addFavoriteBook(this.isbn13)
        } else {
            removeFavoriteBook(this.isbn13)
        }
    }

    onClickLibraryButton() {
        this.libraryBookExist
            .onLibraryBookExist(this.libraryButton, this.isbn13, state.libraries)

    }
    
    onClickLink(event) {
        event.preventDefault()
        location.href = `book?isbn=${this.isbn13}`
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