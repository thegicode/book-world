
import { state, addFavorite, deleteFavorite, includesFavorite } from '../../modules/model.js'

export default class Book extends HTMLElement {
    constructor() {
        super()
        this.libraryBookExist = this.querySelector('library-book-exist')
        this.favoriteButton = this.querySelector('input[name="favorite"]')
        this.onFavorite = this.onFavorite.bind(this)
    }

    connectedCallback() {
        const isbn = this.searchParam('isbn')
        this.request(isbn)
        this.favoriteButton.addEventListener('change', (event) => {
            this.onFavorite(isbn, event)
        })
    }

    disconnectedCallback() {
        this.favoriteButton.removeEventListener('change', this.onFavorite)
    }
    
    async request(isbn) {
        try {
            const response = await fetch(`/usageAnalysisList?isbn13=${isbn}`, { method: 'GET' })
            const data = await response.json()
            this.render(data)
        } catch (error) {
            console.log(error)
        }
    }

    searchParam(key) {
        return new URLSearchParams(location.search).get(key);
    }

    render(data) {
        const {
            book: {
                bookname, authors, bookImageURL, class_nm, class_no, description, isbn13, loanCnt, publication_year, publisher
            },
            keywords,
            recBooks
        } = data // coLoanBooks, loanGrps,loanHistory,

        const bookNames = bookname
            .split(/[=]|[/]|[:]/)
            .map(item => `<p>${item}</p>`)
            .join('')
        const keywordsString = keywords
            .map(item => `<span>${item.word}</span>`)
            .join('')
        const recBooksString = recBooks
            .map(({ bookname, isbn13 }) => `<a href=book?isbn=${isbn13}>${bookname}</a>`)
            .join('')

        if (includesFavorite(isbn13)) {
            this.favoriteButton.checked = true
        }

        this.libraryBookExist.onLibraryBookExist(null, isbn13, state.library)

        this.querySelector('.bookname').innerHTML = bookNames
        this.querySelector('.authors').textContent = authors
        const imageElement = this.querySelector('img')
        imageElement.src = bookImageURL
        imageElement.alt = bookname
        this.querySelector('.class_nm').textContent = class_nm
        this.querySelector('.class_no').textContent = class_no
        this.querySelector('.description').textContent = description
        this.querySelector('.isbn13').textContent = isbn13
        this.querySelector('.loanCnt').textContent = loanCnt.toLocaleString()
        this.querySelector('.publication_year').textContent = publication_year
        this.querySelector('.publisher').textContent = publisher
        this.querySelector('.keyword').innerHTML = keywordsString
        this.querySelector('.recBooks').innerHTML = recBooksString

        const loadingElement = this.querySelector('.loading')
        if (loadingElement) {
            loadingElement.remove()
        }
    }

    onFavorite(isbn, event) {
        const { checked } = event.target
        if (checked) {
            addFavorite(isbn)
        } else {
            deleteFavorite(isbn)
        }
    }
}

