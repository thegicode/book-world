// import { $ } from './selectors.js'

export default class BookList extends HTMLElement {
    constructor() {
        super()
        this.length = 0
        this.summary = this.querySelector('.book-summary')
        this.books = this.querySelector('.books')
    }

    set data(v) {
        this.render(v)
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
        this.observer = null
    }

    request() {
        fetch(`/naver?keyword=${encodeURIComponent(this.keyword)}&display=${10}&start=${this.length + 1}`, {
            method: 'GET'
        })
        .then(data => data.json())
        .then(response => {
            this.data = response
        })
        .catch(e => {
            console.log(e);
        });
    }

    render(data) {
        const { total, start, display, items } = data

        const prevLength = this.length

        this.length += Number(display)

        this.querySelector('.__keyword').textContent = `${this.keyword}`
        this.querySelector('.__length').textContent = `${this.length.toLocaleString()}`
        this.querySelector('.__total').textContent = `${total.toLocaleString()}`
        this.querySelector('.__display').textContent = `${display}개씩`

        this.summary.hidden = false

        this.bookItems(items, prevLength)

        const target = this.querySelector('.observe')
        this.observer.observe(target)
    }

    bookItems(items, prevLength) {
        const fragment = new DocumentFragment()
        items.forEach( (item, index) => {
            const el = document.querySelector('[data-template=book-item').content.firstElementChild.cloneNode(true)
            el.data = item
            el.index = prevLength + index
            fragment.appendChild(el)
        })
        this.books.appendChild(fragment)
    }

    initialize(keyword) {
        this.keyword = keyword
        this.length = 0
        this.books.innerHTML = ''
        this.request()
    }

}