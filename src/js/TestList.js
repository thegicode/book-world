
const sonmeData = [
    'aaa',
    'bbb'
]

export default class BookList extends HTMLElement {
    constructor() {
        super()
        this.selected = 0
    }

    connectedCallback() {
        const fragment = new DocumentFragment()
        sonmeData.forEach( (data, index) => {
            const el = this.getElement(data, index)
            fragment.appendChild(el)
        })
        this.appendChild(fragment)
    }

    getElement(text, index) {
        const el = document.querySelector('#tp-test').content.firstElementChild.cloneNode(true)
        el.textContent = text
        return el
    }

}