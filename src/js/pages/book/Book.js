
import { state, addFavorite, deleteFavorite, includesFavorite } from '../../modules/model.js'

export default class Book extends HTMLElement {
    constructor() {
        super()
        this.libraryBookExist = this.querySelector('library-book-exist')
        this.favoriteButton = this.querySelector('input[name="favorite"]')
        this.onFavorite = this.onFavorite.bind(this)
    }

    connectedCallback() {

        const isbn = this.searchParam('isbn')
        this.request_usageAnalysisList(isbn)

        // TODO 
        const region = {
            '11': ['11250'],
            '31': ['31180']
        }
        for( const [key, value] of Object.entries(region)) {
            this.request_libSrchByBook(isbn, key, value)
        }

        this.favoriteButton.addEventListener('change', (event) => {
            this.onFavorite(isbn, event)
        })
    }

    disconnectedCallback() {
        this.favoriteButton.removeEventListener('change', this.onFavorite)
    }

    // Analysis of usage by book
    async request_usageAnalysisList(isbn) {
        try {
            const response = await fetch(
                `/usageAnalysisList?isbn13=${isbn}`, 
                { method: 'GET' }
            )
            const data = await response.json()
            this.render(data)
        } catch (error) {
            console.log(error)
        }
    }

    // Search library holdings of books
    async request_libSrchByBook(isbn, region, dtl_region) {
        try {
            const response = await fetch(
                `/libSrchByBook?isbn=${isbn}&region=${region}&dtl_region=${dtl_region}`, 
                { method: 'GET' }
            )
            const data = await response.json()
            this.renderLibSrchByBook(data, isbn, dtl_region)
        } catch (error) {
            console.log(error)
        }
    }
    
    // Check Loan Availability
    async fetchLoadnAvailabilty(isbn13, libCode) {
        try {
            const response = await fetch(`/library-bookExist?isbn13=${isbn13}&libCode=${libCode}`, { method: 'GET' })
            const data = await response.json()
            return data.loanAvailable === 'Y'
        } catch (error) {
            console.error(error)
            return false
        }
    }
    updateLoanAvailability(el, isAvailable) {
        el.querySelector('.loanAvailable').textContent = isAvailable ? '대출 가능' : '대출 불가'
    }
    async loanAvailable(isbn13, libCode, el) {
        const isAvailable = await this.fetchLoadnAvailabilty(isbn13, libCode)
        this.updateLoanAvailability(el, isAvailable)
    }

    // async loanAvailable(isbn13, libCode, el) {
    //     try {
    //         const response = await fetch(
    //             `/library-bookExist?isbn13=${isbn13}&libCode=${libCode}`, 
    //             { method: 'GET' }
    //         )
    //         const { loanAvailable } = await response.json()
    //         el.querySelector('.loanAvailable').textContent = loanAvailable === 'Y' ? '대출 가능': '대출 불가'
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    searchParam(key) {
        return new URLSearchParams(location.search).get(key);
    }

    renderLibSrchByBook({ libs }, isbn, region) {
        const component = document.querySelector('.library-search-by-book')
        const listElement = document.createElement('ul')
        const fragment = new DocumentFragment()

        if (!Array.isArray) {
            return
        }

        const listItems = libs.map(({ homepage, libCode, libName }) => {
            const listItem = document.querySelector('#tp-librarySearchByBookItem').content.firstElementChild.cloneNode(true)
            const linkElement = listItem.querySelector('a')
            listItem.dataset.code = libCode
            linkElement.textContent = libName
            linkElement.href = homepage
            this.loanAvailable(isbn, libCode, listItem.querySelector('p'))
            return listItem
        })
        fragment.append(...listItems)
        listElement.appendChild(fragment)
        component.appendChild(listElement)
    }

    render(data) {
        const {
            book: {
                bookname, authors, bookImageURL, class_nm, class_no, description, isbn13, loanCnt, publication_year, publisher
            },
            keywords,
            recBooks
        } = data // coLoanBooks, loanGrps,loanHistory,

        const bookNames = bookname
            .split(/[=]|[/]|[:]/)
            .map(item => `<p>${item}</p>`)
            .join('')
        const keywordsString = keywords
            .map(item => `<span>${item.word}</span>`)
            .join('')
        const recBooksString = recBooks
            .map(({ bookname, isbn13 }) => `<li><a href=book?isbn=${isbn13}>${bookname}</a></li>`)
            .join('')

        if (includesFavorite(isbn13)) {
            this.favoriteButton.checked = true
        }

        this.querySelector('.bookname').innerHTML = bookNames
        this.querySelector('.authors').textContent = authors
        const imageElement = this.querySelector('img')
        imageElement.src = bookImageURL
        imageElement.alt = bookname
        this.querySelector('.class_nm').textContent = class_nm
        this.querySelector('.class_no').textContent = class_no
        this.querySelector('.description').textContent = description
        this.querySelector('.isbn13').textContent = isbn13
        this.querySelector('.loanCnt').textContent = loanCnt.toLocaleString()
        this.querySelector('.publication_year').textContent = publication_year
        this.querySelector('.publisher').textContent = publisher
        this.querySelector('.keyword').innerHTML = keywordsString
        this.querySelector('.recBooks').innerHTML = recBooksString

        const loadingElement = this.querySelector('.loading')
        if (loadingElement) {
            loadingElement.remove()
        }
    }

    onFavorite(isbn, event) {
        const { checked } = event.target
        if (checked) {
            addFavorite(isbn)
        } else {
            deleteFavorite(isbn)
        }
    }
}

