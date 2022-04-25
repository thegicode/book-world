import { $ } from './selectors.js'

import model from '../model.js'
const  { state, deleteFavorite } = model

export default class FavoriteItem extends HTMLElement {
    constructor() {
        super()
        this.favoriteButton = this.querySelector('.favorite-button')
        this.libraryButton = this.querySelector('.library-button')
        this.library = this.querySelector('.favorite-library')
        this.libraryItemTemplate = document.querySelector('#tp-libraryItem')
    }

    connectedCallback() {
        this.loading()
        this.request(this.data)
        this.favoriteButton.addEventListener('click', this.onFavorite.bind(this))
        this.libraryButton.addEventListener('click', this.onLibrary.bind(this))
    }

    disConnectedCallback() {
        this.favoriteButton.removeEventListener('click', this.onFavorite.bind(this))
        this.libraryButton.removeEventListener('click', this.onLibrary.bind(this))
    }

    request(isbn13) {
        fetch(`/usageAnalysisList?isbn13=${isbn13}`, {
            method: 'GET'
        })
        .then(data => data.json())
        .then(response => {
            this.render(response)
        })
        .catch(e => {
            console.log(e);
        });
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
            class_no,
            description,
            isbn13,
            loanCnt,
            publication_year,
            publisher,
            vol
        } = book

        const obj = {
            bookname: `${bookname}`,
            authors: `${authors}`,
            class_nm: `${class_nm}`,
            class_no: `${class_no}`,
            isbn13: `${isbn13}`,
            loanCnt: `${loanCnt.toLocaleString()}`,
            publication_year: `${publication_year}`,
            publisher: `${publisher}`,
            vol: `${vol}`,
        }
        for (const [key, value] of Object.entries(obj)) {
            this.querySelector(`.${key}`).textContent = value
        }

        const img =  this.querySelector('img')
        img.src = `${bookImageURL}`
        img.onload = () => {
            delete this.querySelector('.thumb').dataset.loaded
        }
        img.onerror = () => {
            img.remove()
        }
        this.querySelector('.description').innerHTML = description
        delete this.dataset.loading
    }

    onFavorite(event) {
        deleteFavorite(this.data)
        $.favorite.updateCount()
        this.remove()
    }

    onLibrary() {
        this.libraryLoading()
        this.libraryButton.remove()
        for (const [libCode, libName] of Object.entries(state.library)) {
            fetch(`/library-bookExist?isbn13=${this.data}&libCode=${libCode}`, {
                method: 'GET'
            })
            .then(data => data.json())
            .then(response => {
                const { hasBook, loanAvailable} = response
                const el = this.libraryItemTemplate.content.firstElementChild.cloneNode(true)
                el.querySelector('.name').textContent = libName
                el.querySelector('.hasBook').textContent = hasBook
                el.querySelector('.loanAvailable').textContent = loanAvailable
                this.removeLibraryLoading()
                this.library.appendChild(el)
            })
            .catch(e => {
                console.log(e);
            });
        }
    }

    loading() {
        this.dataset.loading = true
    }

    libraryLoading() {
        this.library.dataset.loading = true
    }
    removeLibraryLoading() {
        const loading = this.library.querySelector('.loading')
        if (loading)
            this.library.querySelector('.loading').remove()
        this.library.removeAttribute('data-loading')
    }
}

