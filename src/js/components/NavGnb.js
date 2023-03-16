import { CustomEventEmitter } from '/js/utils/index.js'
import { getState } from '/js/modules/model.js'

export default class NavGnb extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.favoriteBooksSize = this.getFavoriteBooksSize()
        this.render()
        this.setSelectedMenu()
        CustomEventEmitter.add('favorite-books-changed', this.favoriteBooksChanged.bind(this))

    }

    disconnectedCallback() {
        CustomEventEmitter.remove('favorite-books-changed', this.favoriteBooksChanged)
    }

    getFavoriteBooksSize() {
        return getState().favoriteBooks.length
    }

    render() {
        this.innerHTML =  `
            <nav class="gnb">
                <a class="gnb-item" href="./search">책 검색</a>
                <a class="gnb-item" href="./favorite">나의 책 (<span class="size">${this.favoriteBooksSize}</span>)</a>
                <a class="gnb-item" href="./library">도서관 조회</a>
                <a class="gnb-item" href="./setting">설정</a>
            </nav>`
    }
    
    setSelectedMenu() {
        const PATHS = ['/search', '/favorite', '/library', '/setting']
        const idx = PATHS.indexOf(document.location.pathname)
        if (idx >= 0 )
            this.querySelectorAll('a')[idx].ariaSelected = true
    }

    favoriteBooksChanged({ detail }) {
        const { size } = detail
        this.querySelector('.size').textContent = size | this.getFavoriteBooksSize()
    }

}