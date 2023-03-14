import Observer from "../../modules/Observer.js"
import CustomFetch from "../../modules/CustomFetch.js"

export default class BookContent extends HTMLElement {
    constructor() {
        super()
        this.pages = this.querySelector('.book-pages')
        this.books = this.querySelector('.books')
        this.fetchSearchNaverBook = this.fetchSearchNaverBook.bind(this)
        this.customFetch = new CustomFetch()
    }

    connectedCallback() {
        const target = this.querySelector('.observe')
        const callback = this.fetchSearchNaverBook
        this.observer = new Observer(target, callback)
    }

    disconnectedCallback() {
        this.observer?.disconnect()
    }

    initialize(keyword) {
        this.keyword = keyword
        if (this.keyword) {
            this.length = 0
            this.showMessage('loading')
            this.books.innerHTML = ''
            this.fetchSearchNaverBook()
        } else {
            this.keyword = ''
            this.length = 0
            this.pages.hidden = true
            this.showMessage('message')
        }
    }

    async fetchSearchNaverBook() {
        if (!this.keyword) return
        const url = `/search-naver-book?keyword=${encodeURIComponent(this.keyword)}&display=${10}&start=${this.length + 1}`
        try {
            const data = await this.customFetch.fetch(url)
            this.render(data)
        } catch(error) {
            console.error(error)
            throw new Error('Fail to get naver book.')
        }
    }

    render(data) {
        const { total, start, display, items } = data

        const prevLength = this.length

        this.length += Number(display)

        const obj = {
            keyword: `${this.keyword}`,
            length: `${this.length.toLocaleString()}`,
            total: `${total.toLocaleString()}`,
            display: `${display}개씩`
        }
        for (const [key, value] of Object.entries(obj)) {
            this.querySelector(`.__${key}`).textContent = value
        }

        this.pages.hidden = false

        if (total === 0) {
            this.showMessage('notFound')
            return
        }

        this.bookItems(items, prevLength)

        if (total === this.length) {
            return
        } 

        this.observer.observe()
    }

    bookItems(items, prevLength) {
        const fragment = new DocumentFragment()
        items.forEach( (item, index) => {
            const el = document.querySelector('[data-template=book-item]').content.firstElementChild.cloneNode(true)
            el.data = item
            el.index = prevLength + index
            fragment.appendChild(el)
        })
        this.books.appendChild(fragment)
    }

    showMessage(type) {
        const el = document.querySelector(`#tp-${type}`).content.firstElementChild.cloneNode(true)
        this.books.innerHTML = ''
        this.books.appendChild(el)
    }

}


        // this.observer = new IntersectionObserver( changes => {
        //     changes.forEach( change => {
        //         if (change.isIntersecting) {
        //             this.observer.unobserve(change.target)
        //             this.fetchSearchNaverBook()
        //         }   
        //     })
        // })