// import { $ } from './selectors.js'

export default class BookContent extends HTMLElement {
    constructor() {
        super()
        this.summary = this.querySelector('.book-summary')
        this.books = this.querySelector('.books')
    }

    connectedCallback() {
        this.observer = new IntersectionObserver( changes => {
            changes.forEach( change => {
                if (change.isIntersecting) {
                    this.observer.unobserve(change.target)
                    this.request()
                }   
            })
        })
    }

    disconnectedCallback() {
        this.observer?.disconnect()
    }

    initialize(keyword) {
        this.keyword = keyword
        if (this.keyword) {
            this.length = 0
            this.loading()
            this.books.innerHTML = ''
            this.request()
        } else {
            this.keyword = ''
            this.length = 0
            this.summary.hidden = true
            this.ready()
        }
    }

    async request() {
        const url = `/search-naver-book?keyword=${encodeURIComponent(this.keyword)}&display=${10}&start=${this.length + 1}`
        try {
            const response = await fetch(url)
            const data = await response.json()
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

        this.summary.hidden = false

        if (total === 0) {
            this.notFound()
            return
        }

        this.bookItems(items, prevLength)

        if (total === this.length) {
            return
        } 

        const target = this.querySelector('.observe')
        this.observer.observe(target)
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

    ready() {
        const el = document.querySelector('[data-template=message]').content.firstElementChild.cloneNode(true)
        this.books.innerHTML = ''
        this.books.appendChild(el)
    }

    loading() {
        const el = document.querySelector('[data-template=laoding]').content.firstElementChild.cloneNode(true)
        this.books.innerHTML = ''
        this.books.appendChild(el)
    }

    notFound() {
        const el = document.querySelector('[data-template=notFound]').content.firstElementChild.cloneNode(true)
        this.books.innerHTML = ''
        this.books.appendChild(el)
    }
  
}