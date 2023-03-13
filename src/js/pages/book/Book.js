
import {  getState, addFavoriteBook, removeFavoriteBook, isFavoriteBook } from '../../modules/model.js'

export default class Book extends HTMLElement {
    constructor() {
        super()
        this.libraryBookExist = this.querySelector('library-book-exist')
        this.favoriteButton = this.querySelector('input[name="favorite"]')
        this.onFavorite = this.onFavorite.bind(this)
    }

    connectedCallback() {

        const isbn = this.searchParam('isbn')
        this.fetchUsageAnalysisList(isbn)
 
        const favoriteLibraries = getState().regions
        for (const item in favoriteLibraries) {
            const detailCodes = Object.values(favoriteLibraries[item])
            const regionCode = detailCodes[0].slice(0, 2)
            detailCodes.forEach( detailCode => {
                this.fetchLibrarySearchByBook(isbn, regionCode, detailCode)
            })
        }

        this.favoriteButton.addEventListener('change', (event) => {
            this.onFavorite(isbn, event)
        })
    }

    disconnectedCallback() {
        this.favoriteButton.removeEventListener('change', this.onFavorite)
    }

    // Analysis of usage by book
    async fetchUsageAnalysisList(isbn) {
        try {
            const response = await fetch(
                `/usage-analysis-list?isbn13=${isbn}`, 
                { method: 'GET' }
            )
            const data = await response.json()
            this.render(data)
        } catch (error) {
            console.log(error)
        }
    }

    // Search library holdings of books
    async fetchLibrarySearchByBook(isbn, region, dtl_region) {
        try {
            const url = new URL('/library-search-by-book', window.location.href)
            url.searchParams.set('isbn', isbn)
            url.searchParams.set('region', region)
            url.searchParams.set('dtl_region', dtl_region)

            const response = await fetch(url.toString(), {method: 'GET'})
            if (!response.ok) {
                throw new Error(`Failed to fetch library data: ${response.statusText}`)
            }

            const data = await response.json()
            this.renderLibSrchByBook(data, isbn)
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    
    // Check Loan Availability
    async fetchLoadnAvailabilty(isbn13, libCode) {
        try {
            const response = await fetch(`/book-exist?isbn13=${isbn13}&libCode=${libCode}`, { method: 'GET' })
            const data = await response.json()
            return data.loanAvailable === 'Y'
        } catch (error) {
            console.error(error)
            return false
        }
    }
    updateLoanAvailability(el, isAvailable) {
        const element = el.querySelector('.loanAvailable')
        element.textContent = isAvailable ? '대출 가능' : '대출 불가'
        if (isAvailable) {
            el.parentElement.dataset.available = true
        }
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

    renderLibSrchByBook({ libs }, isbn) {
        const component = document.querySelector('.library-search-by-book')
        if (!component) return

        const listElement = document.createElement('ul')
        const fragment = new DocumentFragment()

        if (!Array.isArray) return

        libs.forEach(({ homepage, libCode, libName }) => {
            const template = document.querySelector('#tp-librarySearchByBookItem')
            if (!template) return

            const cloned = template.content.firstElementChild.cloneNode(true)
            const link = cloned.querySelector('a')
            if (!link) return

            cloned.dataset.code = libCode
            link.textContent = libName
            link.href = homepage
            this.loanAvailable(isbn, libCode, cloned.querySelector('p'))
            
            fragment.appendChild(cloned)
        })

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
            .split(/[=\/:]/)
            .map(item => `<p>${item}</p>`)
            .join('')
        const keywordsString = keywords
            .map(item => `<span>${item.word}</span>`)
            .join('')
        const recBooksString = recBooks
            .map(({ bookname, isbn13 }) => `<li><a href=book?isbn=${isbn13}>${bookname}</a></li>`)
            .join('')

        this.favoriteButton.checked = isFavoriteBook(isbn13)
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
        if (event.target.checked) {
            addFavoriteBook(isbn)
        } else {
            removeFavoriteBook(isbn)
        }
    }
}

