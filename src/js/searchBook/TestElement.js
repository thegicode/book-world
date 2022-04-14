
export default class BookList extends HTMLElement {
    constructor() {
        super()
    }

    get src() {
        return this.getAttribute('src')
    }

    connectedCallback() {
        fetch(`${this.src}.html`) 
            .then( response => response.text() ) 
            .then( htmlStr => {
                const parser = new DOMParser()
                const dom = parser.parseFromString(htmlStr, "text/html")
                const tp = dom.querySelector('div')
                this.appendChild(tp)
            })
    }

    disconnectedCallback() {
    }

}