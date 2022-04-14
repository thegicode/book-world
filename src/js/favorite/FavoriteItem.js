import { $ } from './selectors.js'
import model from '../model.js'

const models = model()
const  { deleteFavorite } = models

export default class FavoriteItem extends HTMLElement {
    constructor() {
        super()
        this.favoriteButton = this.querySelector('.favorite-button')
        this.hasBookButton = this.querySelector('.hasBook-button')

    }

    connectedCallback() {
        this.request(this.data)
        this.favoriteButton.addEventListener('click', this.onFavorite.bind(this))
        this.hasBookButton.addEventListener('click', this.onHasBook.bind(this))
    }

    disConnectedCallback() {
        this.favoriteButton.removeEventListener('click', this.onFavorite.bind(this))
        this.hasBookButton.removeEventListener('click', this.onHasBook.bind(this))
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
        this.querySelector('img').src = bookImageURL
        this.querySelector('.description').innerHTML = description
    }

    onFavorite(event) {
        deleteFavorite(this.data)
        $.favorite.updateCount()
        this.remove()
    }

    onHasBook() {
        const hasBookEl = this.querySelector('.__hasBook')
        const loanAvailableEl = this.querySelector('.__loanAvailable')
        const libCode = '111007'
        fetch(`/library-bookExist?isbn13=${this.data}&libCode=${libCode}`, {
            method: 'GET'
        })
        .then( data => data.json())
        .then( response => {
            const { hasBook, loanAvailable } = response
            const _hasBook = hasBook === 'Y' ? '소장' : '미소장'
            hasBookEl.textContent = `소장: ${_hasBook}`
            if ( hasBook === 'Y' ) {
                const _loan = loanAvailable === 'Y' ? '가능' : '불가'
                loanAvailableEl.textContent = `대출: ${_loan}`
            }
        })
        .catch(e => {
            console.log(e);
        });
    }
}

