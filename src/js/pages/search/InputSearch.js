
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
        this.form.removeEventListener('submit', this.onSubmit)
    }

    onSubmit(event) {
        event.preventDefault()
        
        const keyword = this.input.value 
        if (!keyword) return

        this.input.value = ''

        const url = new URL(window.location.href)
        url.searchParams.set('keyword', keyword)
        window.history.pushState({}, "", url)

        $.bookContent.initialize(keyword)
        // if (keyword !== $.bookContent.keyword) {
        //     $.bookContent.initialize(keyword)
        // }

        this.input.focus()
    }
  
}




