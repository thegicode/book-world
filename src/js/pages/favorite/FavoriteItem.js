import { $ } from './selectors.js'
import model from '../../modules/model.js'
// import newCustomEvent from '../modules/NewCustomEvent.js'

const  { state, deleteFavorite } = model

export default class FavoriteItem extends HTMLElement {
    constructor() {
        super()
        this.favoriteButton = this.querySelector('.favorite-button')
        this.libraryButton = this.querySelector('.library-button')
        this.libraryBookExist = this.querySelector('library-book-exist')

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

        // const names = bookname.split(' =')
        // const name = names[0]
        // const subName = names[1]

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
        img.onerror = () => {
            img.remove()
        }

        this.querySelector('book-description').data = description

        delete this.dataset.loading
    }

    onFavorite(event) {
        deleteFavorite(this.data)
        $.favorite.updateCount()
        this.remove()
    }

    onLibrary() {
        this.libraryBookExist
            .onLibraryBookExist(this.libraryButton, this.data, state.library)
    }

    loading() {
        this.dataset.loading = true
    }
    
}

