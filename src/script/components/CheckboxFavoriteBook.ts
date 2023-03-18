import { CustomEventEmitter } from '../utils/index'
import { addFavoriteBook, removeFavoriteBook, isFavoriteBook } from '../modules/model'

export default class CheckboxFavoriteBook extends HTMLElement {

    private $input: HTMLInputElement | null
    private isbn: string | null

    constructor() {
        super()
        this.$input = null
        this.isbn = null
    }

    connectedCallback(): void {
        const isbnElement = this.closest('[data-isbn]') 
        this.isbn = (isbnElement as HTMLElement & { dataset: { isbn: string } }).dataset.isbn;
        this.render()
        this.$input?.addEventListener('change', this.onChange.bind(this))
    }

    disconnectedCallback(): void {
        this.$input?.addEventListener('change', this.onChange)
    }

    private render(): void {
        const isbn = this.isbn || ''
        const checked = isFavoriteBook(isbn) ? 'checked' : ''
        this.innerHTML = `<label>
            <input type="checkbox" name="favorite" ${checked}>
            <span>관심책</span>
        </label>`
        this.$input = this.querySelector('input')
    }

    private onChange(): void {
        const ISBN = this.isbn || ''
        if (this.$input?.checked) {
            addFavoriteBook(ISBN)
        } else {
            removeFavoriteBook(ISBN)
        }
        CustomEventEmitter.dispatch('favorite-books-changed')
    }

}