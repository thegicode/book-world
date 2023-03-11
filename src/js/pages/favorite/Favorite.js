import { getState } from '../../modules/model.js'
import CustomEventEmitter from "../../modules/CustomEventEmitter.js"

export default class Favorite extends HTMLElement {
    
    static get observedAttributes() {
        return ['count']
    }

    $booksEl
    $countEl
    $observer

    set count(value) {
        this.setAttribute('count', value)
    }
    get count() {
        return this.getAttribute('count')
    }

    get favoriteBooks() {
        return getState().favoriteBooks
    }

    constructor() {
        super()

        this.$booksEl = this.querySelector('.favorite-books')
        this.$countEl = this.querySelector('.count')
        
        this.updateCount = this.updateCount.bind(this)
        CustomEventEmitter.add('favorite-books-changed', this.favoriteBooksChanged.bind(this))
    }

    connectedCallback() {
        // 속성 변경을 감지하기 위해 MutationObserver를 사용합니다.
        // this.$observer = new MutationObserver(this.updateCount)
        this.$observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.attributeName === 'count') {
                    this.updateCount()
                } else if (mutation.type ==='childList') {
                    // console.log(mutation.type)
                    // this.render()
                }
            }
        })
        this.$observer.observe(this, { attributes: true, childList: true, subtree: true })

        this.updateCount()
        this.render()
    }

    disconnectedCallback() {
        this.$observer.disconnect();
    }

    favoriteBooksChanged({ detail }) {
        this.count = detail.count
    }

    updateCount() {
        const count = this.count || this.favoriteBooks.length
        this.$countEl.textContent = `${count}권`
    }

    render() {
        const fragment = new DocumentFragment()
        const template = document.querySelector('#tp-favorite-item').content.firstElementChild
        if (template) {
            this.favoriteBooks.forEach( item => {
                const el = template.cloneNode(true)
                el.dataset.isbn = item
                fragment.appendChild(el)
            })
        }
        
        this.$booksEl.appendChild(fragment)
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'count') {
            this.updateCount()
        }
    }

}

