import { CustomEventEmitter, CustomFetch } from '../../utils/index.js'
import { state, addFavoriteBook, removeFavoriteBook } from '../../modules/model.js'

export default class FavoriteItem extends HTMLElement {
    constructor() {
        super()
        this.libraryButton = this.querySelector('.library-button')
        this.libraryBookExist = this.querySelector('library-book-exist')
        this.link = this.querySelector('a')
    }

    connectedCallback() {
        this.loading()
        this.fetchData(this.dataset.isbn)
        this.libraryButton.addEventListener('click', this.onLibrary.bind(this))
        this.link.addEventListener('click', this.onClick.bind(this))
    }

    disconnectedCallback() {
        this.libraryButton.removeEventListener('click', this.onLibrary)
        this.link.removeEventListener('click', this.onClick)
    }

    async fetchData(isbn) {
        const url = `/usage-analysis-list?isbn13=${isbn}`
        try {
            const data = await CustomFetch.fetch(url)
            this.render(data)
        } catch(error) {
            this.errorRender()
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

        this.querySelector('.bookname').textContent = bookname
        this.querySelector('.authors').textContent = authors
        this.querySelector('.class_nm').textContent = class_nm
        this.querySelector('.isbn13').textContent = isbn13
        this.querySelector('.loanCnt').textContent = loanCnt.toLocaleString()
        this.querySelector('.publication_year').textContent = publication_year
        this.querySelector('.publisher').textContent = publisher
        this.querySelector('book-description').data = description

        this.querySelector('book-image').data = {
            bookImageURL,
            bookname
        }

        this.removeLoading()
    }

    errorRender() {
        this.removeLoading()
        this.dataset.fail = true
        this.querySelector('h4')
            .textContent = `${this.dataset.isbn}의 책 정보를 가져올 수 없습니다.`
        
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

