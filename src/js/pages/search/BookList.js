import Observer from "/js/modules/Observer.js"
import CustomFetch from "/js/modules/CustomFetch.js"
import CustomEventEmitter from '/js/modules/CustomEventEmitter.js'
// import { Observer, CustomFetch, CustomEventEmitter } from '../../js/modules/index.js'

export default class BookList extends HTMLElement {
    constructor() {
        super()
        this._initializeProperties()
        this._bindMethods()
    }

    _initializeProperties() {
        this.pagingInfo = this.querySelector('.paging-info')
        this.books = this.querySelector('.books')
    }

    _bindMethods() {
        this.fetchSearchNaverBook = this.fetchSearchNaverBook.bind(this)
    }

    connectedCallback() {
        this._setupObserver()
        CustomEventEmitter.add('search-page-init', this.onSearchPageInit.bind(this))
    }

    disconnectedCallback() {
        this.observer?.disconnect()
        CustomEventEmitter.remove('search-page-init', this.onSearchPageInit)
    }

    _setupObserver() {
        const target = this.querySelector('.observe')
        const callback = this.fetchSearchNaverBook
        this.observer = new Observer(target, callback)
    }

    onSearchPageInit({ detail }) {
        console.log(detail.keyword)
        this.keyword = detail.keyword
        this.length = 0

        if (this.keyword) { // onSubmit으로 들어온 경우와 브라우저 
            this._handleKeywordPresent()
            return
        } 

        // keyword 없을 때 기본 화면 노출, 브라우저
        this._handleKeywordAbsent()
    }

    _handleKeywordPresent() {
        this.showMessage('loading')
        this.books.innerHTML = ''
        this.fetchSearchNaverBook()
    }

    _handleKeywordAbsent() {
        this.pagingInfo.hidden = true
        this.showMessage('message')
    }

    async fetchSearchNaverBook() {
        if (!this.keyword) return

        const url = `/search-naver-book?keyword=${encodeURIComponent(this.keyword)}&display=${10}&start=${this.length + 1}`
        try {
            const data = await CustomFetch.fetch(url)
            this._render(data)
        } catch(error) {
            console.error(error)
            throw new Error('Fail to get naver book.')
        }
    }

    _render(data) {
        const { total, start, display, items } = data
        const prevLength = this.length

        this.length += Number(display)
        this._updatePagingInfo({ total, display })

        this.pagingInfo.hidden = false

        if (total === 0) {
            this.showMessage('notFound')
            return
        }

        this._appendBookItems(items, prevLength)

        if (total !== this.length) {
            this.observer.observe()
        } 
    }

    _updatePagingInfo({ total, display }) {
        const obj = {
            keyword: `${this.keyword}`,
            length: `${this.length.toLocaleString()}`,
            total: `${total.toLocaleString()}`,
            display: `${display}개씩`
        }
        for (const [key, value] of Object.entries(obj)) {
            this.pagingInfo.querySelector(`.__${key}`).textContent = value
        }
    }

    _appendBookItems(items, prevLength) {
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