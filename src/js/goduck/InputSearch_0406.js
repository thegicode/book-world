
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
        // const libCode = '111007'
        // fetch(`/library-itemSrch?keyword=${keyword}`, {
        //     method: 'GET'
        // })
        // .then(data => data.json())
        // .then(response => {
        //     selectors.bookList.data = response
        // })
        // .catch(e => {
        //     console.log(e);
        // });


        // fetch(`/library-bookExist?isbn13=${isbn13}&libCode=${libCode}`, {
        //     method: 'GET'
        // })
        // .then( data => data.json())
        // .then( response => {
        //     const { hasBook, loanAvailable } = response
        //     el.querySelector('.__hasBook').textContent
        //         = `소장: ${hasBook}`
        //     el.querySelector('.__loanAvailable').textContent
        //         = `대출: ${loanAvailable}`
        // })
        // .catch(e => {
        //     console.log(e);
        // });
        
    }
}