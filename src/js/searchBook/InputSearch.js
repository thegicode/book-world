
import { $ } from './selectors.js'

export default class InputSearch extends HTMLElement {
    constructor() {
        super()
        this.form = this.querySelector('form')
        this.input = this.querySelector('input')
    }

    connectedCallback() {
        this.form.addEventListener('submit', this.onSubmit.bind(this))
    }

    disconnectedCallback() {
        this.form.removeEventListener('submit', this.onSubmit.bind(this))
    }

    onSubmit() {
        event.preventDefault()

        const keyword = this.input.value
        this.input.value = ''

        if (keyword !== $.bookContent.keyword) {
            $.bookContent.initialize(keyword)
        }
    }
}




