
const sonmeData = [
    {
        id: '123',
        name: '제주1',
        count: 10,
        time: '오전 7:45:58'
    },
    {
        id: '456',
        name: '제주2',
        count: 20,
        time: '오후 2:45:58'
    }
]

export default class ReceiptList extends HTMLElement {
    constructor() {
        super()
        this.selected = 0
    }

    connectedCallback() {
        const fragment = new DocumentFragment()
        sonmeData.forEach( (obj, index) => {
            const el = this.getElement(obj, index)
            fragment.appendChild(el)
        })

        // sonmeData
        //     .map((obj, index) => this.getElement(obj, index))
        //     .forEach(el => {
        //         fragment.appendChild(el)
        //     })
        this.appendChild(fragment)
    }

    getElement(obj, index) {
        const { id, name, count, time } = obj
        const el = document.querySelector('#tp-book-item').content.firstElementChild.cloneNode(true)
        el.dataset.id = id
        el.querySelector('.__name').textContent = name
        el.querySelector('.__count').textContent = count
        el.querySelector('.__time').textContent = time
        if (this.selected === index) {
            el.setAttribute('selected', true)
        }
        this.addEvents(el, index)
        return el
    }

    addEvents(el, index) {
        el.addEventListener('click', () => {

        })
    }
}