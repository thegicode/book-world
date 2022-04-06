
import { selectors } from './selectors.js'


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
        this.request(this.input.value)
    }


    request(keyword) {
        fetch(`/naver?keyword=${encodeURIComponent(keyword)}&display=${10}&start=${1}`, {
            method: 'GET'
        })
        .then(data => data.json())
        .then(response => {
            selectors.bookList.data = response
            selectors.bookList.keyword = keyword 
        })
        .catch(e => {
            console.log(e);
        });
    }
}