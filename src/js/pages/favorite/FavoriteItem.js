import { state, removeFavoriteBook } from '../../modules/model.js'
import newCustomEvent from "../../modules/newCustomEvent.js"

export default class FavoriteItem extends HTMLElement {
    constructor() {
        super()
        this.favoriteButton = this.querySelector('.favorite-button')
        this.libraryButton = this.querySelector('.library-button')
        this.libraryBookExist = this.querySelector('library-book-exist')
        this.link = this.querySelector('a')
    }

    connectedCallback() {
        this.loading()
        this.request(this.data)
        this.favoriteButton.addEventListener('click', this.onFavorite.bind(this))
        this.libraryButton.addEventListener('click', this.onLibrary.bind(this))
        this.link.addEventListener('click', this.onClick.bind(this))
    }

    disconnectedCallback() {
        this.favoriteButton.removeEventListener('click', this.onFavorite)
        this.libraryButton.removeEventListener('click', this.onLibrary)
        this.link.removeEventListener('click', this.onClick)
    }

    async request(isbn) {
        console.log(isbn)
        const url = `/usage-analysis-list?isbn13=${isbn}`
        try {
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error('Fail to get usage analysis list data.')
            }
            const data = await response.json()
            this.render(data)
        } catch(error) {
            this.errorRender()
            console.error(error)
            throw new Error('Fail to get usage analysis list data.')
        }
        
        // fetch(`/usage-analysis-list?isbn13=${isbn13}`, {
        //     method: 'GET'
        // })
        // .then(data => data.json())
        // .then(response => {
        //     this.render(response)
        // })
        // .catch(e => {
        //     console.log(e);
        // });
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

        const thumbnail =  this.querySelector('img')
        thumbnail.src = bookImageURL
        thumbnail.onerror = () => {
            thumbnail.remove()
        }

        this.querySelector('book-description').data = description

        this.removeLoading()
    }

    errorRender() {
        this.removeLoading()
        this.dataset.fail = true
        // this.innerHTML = ''
        // const el = document.querySelector('#tp-message').content.firstElementChild.cloneNode(true)
        // this.appendChild(el)
    }

    onFavorite() {
        removeFavoriteBook(this.data)
        newCustomEvent.dispatch('favorite-books-changed', { count: state.favoriteBooks.length })
        // document.querySelector('app-favorite').count = state.favoriteBooks.length
        this.remove()
    }

    onLibrary() {
        this.libraryBookExist
            .onLibraryBookExist(this.libraryButton, this.data, state.libraries)
    }

    loading() {
        this.dataset.loading = true
    }
    removeLoading() {
        delete this.dataset.loading
    }
    
    onClick(event) {
        event.preventDefault()
        location.href = `book?isbn=${this.data}`
    }
}

