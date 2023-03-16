
import { CustomEventEmitter, CustomFetch } from '../../utils/index.js'
import { state, addFavoriteBook, removeFavoriteBook, isFavoriteBook } from '../../modules/model.js'

export default class Book extends HTMLElement {
    constructor() {
        super()
        this.$loadingElement = this.querySelector('.loading')
    }

    connectedCallback() {
        const isbn = new URLSearchParams(location.search).get('isbn')
        this.dataset.isbn = isbn
        this._fetchUsageAnalysisList(isbn)
    }

    disconnectedCallback() {
    }

    async _fetchUsageAnalysisList(isbn) {
        try {
            const data = await CustomFetch.fetch(`/usage-analysis-list?isbn13=${isbn}`)
            this._render(data)
        } catch (error) {
            this._renderError()
            console.log(error)
            throw new Error(`Fail to get usage analysis list.`)
        }
    }

    _render(data) {
        const {
            book: {
                bookname, authors, bookImageURL, class_nm, class_no, description, isbn13, loanCnt, publication_year, publisher
            },
            keywords,
            recBooks
        } = data // coLoanBooks, loanGrps,loanHistory,

        const bookNames = bookname
            .split(/[=\/:]/)
            .map(item => `<p>${item}</p>`)
            .join('')
        const keywordsString = keywords
            .map(item => `<span>${item.word}</span>`)
            .join('')
        const recBooksString = recBooks
            .map(({ bookname, isbn13 }) => `<li><a href=book?isbn=${isbn13}>${bookname}</a></li>`)
            .join('')
        this.querySelector('.bookname').innerHTML = bookNames
        this.querySelector('.authors').textContent = authors
        this.querySelector('.class_nm').textContent = class_nm
        this.querySelector('.class_no').textContent = class_no
        this.querySelector('.description').textContent = description
        this.querySelector('.isbn13').textContent = isbn13
        this.querySelector('.loanCnt').textContent = loanCnt.toLocaleString()
        this.querySelector('.publication_year').textContent = publication_year
        this.querySelector('.publisher').textContent = publisher
        this.querySelector('.keyword').innerHTML = keywordsString
        this.querySelector('.recBooks').innerHTML = recBooksString
        
        this.querySelector('book-image').data = {
            bookImageURL,
            bookname
        }

        this.$loadingElement.remove()
    }


    _renderError() {
        this.$loadingElement.textContent = '정보를 가져올 수 없습니다.'
    }
}

