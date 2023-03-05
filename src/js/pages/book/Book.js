import model from '../../modules/model.js'
const  { state } = model

export default class Book extends HTMLElement {
    constructor() {
        super()
        this.libraryBookExist = this.querySelector('library-book-exist')
        // this.libraryButton = this.querySelector('.library-button')
    }

    connectedCallback() {
        const isbn = this.searchParam('isbn')
        this.request(isbn)
        // this.libraryButton.addEventListener('click', this.onLibrary.bind(this, isbn))

    }

    disConnectedCallback() {
        // this.libraryButton.removeEventListener('click', this.onLibrary.bind(this))
    }

    request(isbn) {
        fetch(`/usageAnalysisList?isbn13=${isbn}`, {
            method: 'GET'
        })
        .then(data => data.json())
        .then(response => {
            this.render(response)
        })
        .catch(e => {
            console.log(e);
        })
    }

    searchParam(key) {
        return new URLSearchParams(location.search).get(key);
    }

    render(data) {
        const {
            book,
            coLoanBooks,
            keywords,
            loanGrps,
            loanHistory,
            recBooks
        } = data

        const  {
            bookname,
            authors,
            bookImageURL,
            class_nm,
            class_no,
            description,
            isbn13,
            loanCnt,
            publication_year,
            publisher
        } = book

        // console.log(coLoanBooks)
        // console.log(loanGrps)
        // console.log(loanHistory)

        const bookNames_1 = bookname.split(/[=]|[/]|[:]/)
        const bookNames_2 = bookNames_1.map( (item, index) => {
            return `<p>${item}</p>`
        }).join('')

        const keywords_2 = keywords.map( item => {
            return `<span>${item.word}</span>`
        }).join('')

        const recBooksString = recBooks.map( recBook => {
            const {bookname, isbn13} = recBook
            return `<a href=book?isbn=${isbn13}>${bookname}</a>`
        }).join('')

        this.libraryBookExist.onLibraryBookExist(null, isbn13, state.library)

        this.querySelector('.bookname').innerHTML = bookNames_2
        this.querySelector('.authors').textContent = authors
        const img = this.querySelector('img')
        img.src = bookImageURL
        img.setAttribute('alt', bookname)
        this.querySelector('.class_nm').textContent = class_nm
        this.querySelector('.class_no').textContent = class_no
        this.querySelector('.description').textContent = description
        this.querySelector('.isbn13').textContent = isbn13
        this.querySelector('.loanCnt').textContent = loanCnt.toLocaleString()
        this.querySelector('.publication_year').textContent = publication_year
        this.querySelector('.publisher').textContent = publisher
        this.querySelector('.keyword').innerHTML = keywords_2
        this.querySelector('.recBooks').innerHTML = recBooksString

        this.querySelector('.loading').remove()

    }

    onLibrary(isbn) {
        this.libraryBookExist
            .onLibraryBookExist(this.libraryButton, isbn, state.library)
    }
}

