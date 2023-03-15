import { state, removeFavoriteBook, CustomEventEmitter, CustomFetch } from '../../modules/index.js'

export default class FavoriteItem extends HTMLElement {
    constructor() {
        super()
        this.favoriteButton = this.querySelector(':scope .favorite-button')
        this.libraryButton = this.querySelector(':scope .library-button')
        this.libraryBookExist = this.querySelector(':scope library-book-exist')
        this.link = this.querySelector('a')
    }

    connectedCallback() {
        this.loading()
        this.fetchData(this.dataset.isbn)
        this.favoriteButton.addEventListener('click', this.onFavorite.bind(this))
        this.libraryButton.addEventListener('click', this.onLibrary.bind(this))
        this.link.addEventListener('click', this.onClick.bind(this))
    }

    disconnectedCallback() {
        this.favoriteButton.removeEventListener('click', this.onFavorite)
        this.libraryButton.removeEventListener('click', this.onLibrary)
        this.link.removeEventListener('click', this.onClick)
    }

    async fetchData(isbn) {
        const url = `/usage-analysis-list?isbn13=${isbn}`
        try {
            const data = await CustomFetch.fetch(url)
            this.render(data)
        } catch(error) {
            console.error(error)
            throw new Error(`Fail to get usage analysis list.`)
        }
    }

    render(data) {
        const { 
            book, 
            loanHistory,
            loanGrps,
            keywords,
            recBooks,
            coLoanBooks
        } = data

        const {
            authors,
            bookImageURL,
            bookname,
            class_nm,
            // class_no,
            description,
            isbn13,
            loanCnt,
            publication_year,
            publisher,
            // vol
        } = book

        this.linkData = data

        this.querySelector(':scope .bookname').textContent = bookname
        this.querySelector(':scope .authors').textContent = authors
        this.querySelector(':scope .class_nm').textContent = class_nm
        this.querySelector(':scope .isbn13').textContent = isbn13
        this.querySelector(':scope .loanCnt').textContent = loanCnt.toLocaleString()
        this.querySelector(':scope .publication_year').textContent = publication_year
        this.querySelector(':scope .publisher').textContent = publisher

        const thumbnail =  this.querySelector('img')
        thumbnail.src = `${bookImageURL}`
        thumbnail.onerror = () => {
            thumbnail.remove()
        }

        this.querySelector(':scope book-description').data = description

        this.removeLoading()
    }

    errorRender() {
        this.removeLoading()
        this.dataset.fail = true
        this.querySelector('h4')
            .textContent = `${this.dataset.isbn}의 책 정보를 가져올 수 없습니다.`
        
    }

    onFavorite() {
        removeFavoriteBook(this.dataset.isbn)
        CustomEventEmitter.dispatch('favorite-books-changed', { count: state.favoriteBooks.length })
        this.remove()
    }

    onLibrary() {
        this.libraryBookExist
            .onLibraryBookExist(this.libraryButton, this.dataset.isbn, state.libraries)
    }

    loading() {
        this.dataset.loading = true
    }
    removeLoading() {
        delete this.dataset.loading
    }
    
    onClick(event) {
        event.preventDefault()
        location.href = `book?isbn=${this.dataset.isbn}`
    }
}

