

import { getState, CustomFetch } from '../../modules/index.js'

export default class LibrarySearchByBook extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const isbn = new URLSearchParams(location.search).get('isbn')
        this.fetchList(isbn)
    }

    async fetchList(isbn) {
        const favoriteLibraries = getState().regions
        for (const item in favoriteLibraries) {
            const detailCodes = Object.values(favoriteLibraries[item])
            const regionCode = detailCodes[0].slice(0, 2)
            detailCodes.forEach( detailCode => {
                this.fetchLibrarySearchByBook(isbn, regionCode, detailCode)
            })
        }
    }

    async fetchLibrarySearchByBook(isbn, region, dtl_region) {
        const searchParams = new URLSearchParams({
            isbn,
            region,
            dtl_region
        })
        const url = `/library-search-by-book?${searchParams}`
    
        try {
            const data = await CustomFetch.fetch(url)
            this.render(data, isbn)
        } catch (error) {
            console.error(error)
            throw new Error(`Fail to get library search by book.`)
        }
    }

    render({ libs }, isbn) {
        if (libs.length < 1) return

        const container = document.querySelector('.library-search-by-book')
        if (!container) return
    
        const listElement = document.createElement('ul')
        const fragment = new DocumentFragment()
    
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
        container.appendChild(listElement)
    }

    async loanAvailable(isbn, libCode, el) {
        const isAvailable = await this.fetchLoadnAvailabilty(isbn, libCode)
        const element = el.querySelector('.loanAvailable')
        element.textContent = isAvailable ? '대출 가능' : '대출 불가'
        if (isAvailable) {
            el.parentElement.dataset.available = true
        }
    }

    async fetchLoadnAvailabilty(isbn13, libCode) {
        const searchParams = new URLSearchParams({
            isbn13,
            libCode
        })
        const url = `/book-exist?${searchParams}`
        
        try {
            const data = await CustomFetch.fetch(url)
            return data.loanAvailable === 'Y'
        } catch (error) {
            console.error(error)
            throw new Error(`Fail to get book exist.`)
        }
    }
    
}

