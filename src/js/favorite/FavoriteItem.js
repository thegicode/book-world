import { $ } from './selectors.js'

import model from '../model.js'
const  { state, deleteFavorite } = model

export default class FavoriteItem extends HTMLElement {
    constructor() {
        super()
        this.favoriteButton = this.querySelector('.favorite-button')
        this.hasBookButton = this.querySelector('.library-button')
        this.library = this.querySelector('.favorite-library')
    }

    connectedCallback() {
        this.request(this.data)
        this.favoriteButton.addEventListener('click', this.onFavorite.bind(this))
        this.hasBookButton.addEventListener('click', this.onLibrary.bind(this))
    }

    disConnectedCallback() {
        this.favoriteButton.removeEventListener('click', this.onFavorite.bind(this))
        this.hasBookButton.removeEventListener('click', this.onLibrary.bind(this))
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
            loanCnt: `${loanCnt}`,
            publication_year: `${publication_year}`,
            publisher: `${publisher}`,
            vol: `${vol}`,
        }
        for (const [key, value] of Object.entries(obj)) {
            this.querySelector(`.${key}`).textContent = value
        }
        
        const thumb = this.querySelector('.thumb')
        const img =  this.querySelector('img')
        img.src = bookImageURL
        img.onload = () => {
            thumb.dataset.load = true
            img.hidden = false
        }
        img.onerror = () => {
            img.remove()
        }
        this.querySelector('.details').hidden = false
        this.querySelector('.description').innerHTML = description
    }

    onFavorite(event) {
        deleteFavorite(this.data)
        $.favorite.updateCount()
        this.remove()
    }

    onLibrary() {
        for (const [libCode, libName] of Object.entries(state.library)) {
            fetch(`/library-bookExist?isbn13=${this.data}&libCode=${libCode}`, {
                method: 'GET'
            })
            .then(data => data.json())
            .then(response => {
                const { hasBook, loanAvailable} = response
                const el = document.querySelector('#tp-libraryItem').content.firstElementChild.cloneNode(true)
                el.querySelector('.name').textContent = libName
                el.querySelector('.hasBook').textContent = hasBook
                el.querySelector('.loanAvailable').textContent = loanAvailable
                this.library.appendChild(el)
            })
            .catch(e => {
                console.log(e);
            });
        }
    }
}

