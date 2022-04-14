import { $ } from './selectors.js'
import model from '../model.js'

const models = model()
const  { deleteFavorite } = models

export default class FavoriteItem extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.request(this.data)
    }

    disConnectedCallback() {
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
        this.querySelector('.favorite-button')
            .addEventListener('click', this.onFavorite.bind(this))
    }

    onFavorite(event) {
        deleteFavorite(this.data)
        $.favorite.updateCount()
        this.remove()
    }

}

