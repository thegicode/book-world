import { CustomEventEmitter } from '/js/utils/index.js'
import { state, addFavoriteBook, removeFavoriteBook, isFavoriteBook } from '/js/modules/model.js'

export default class CheckboxFavoriteBook extends HTMLElement {
    constructor() {
        super()
        this.$input = null
        this.isbn = null
    }

    connectedCallback() {
        this.isbn = this.closest('[data-isbn]').dataset.isbn
        this.render()
        this.$input.addEventListener('change', this.onChange.bind(this))
    }

    disconnectedCallback() {
        this.$input.addEventListener('change', this.onChange)
    }

    render() {
        const checked = isFavoriteBook(this.isbn) ? 'checked' : ''
        this.innerHTML = `<label>
            <input type="checkbox" name="favorite" ${checked}>
            <span>관심책</span>
        </label>`
        this.$input = this.querySelector('input')
    }

    onChange() {
        const ISBN = this.isbn
        if (this.$input.checked) {
            addFavoriteBook(ISBN)
        } else {
            removeFavoriteBook(ISBN)
        }
        const favoriteBookCount = state.favoriteBooks.length
        CustomEventEmitter.dispatch('favorite-books-changed', { count: favoriteBookCount })
    }

}