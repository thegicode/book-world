

export default class BookList extends HTMLElement {
    constructor() {
        super()
        this.length = 0
        this.summary = this.querySelector('.book-summary')
        this.books = this.querySelector('.books')
        this.store = JSON.parse(localStorage.getItem('BookWorld')) || {favorite: []}
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
            const el = document.querySelector('[data-template=book-item').content.firstElementChild.cloneNode(true)
            el.data = item
            el.index = prevLength + index
            el.store = this.store
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