
export default class BookList extends HTMLElement {
    constructor() {
        super()
    }

    set data(v) {
        this.render(v)
    }

    connectedCallback() {
    }

    disconnectedCallback() {
    }

    render(data) {
        const books = this.querySelector('.books')
        books.innerHTML = ''

        const { total, start, display, items } = data
        this.querySelector('.__total').textContent = `total: ${total}`
        this.querySelector('.__start').textContent = `start: ${start}`
        this.querySelector('.__display').textContent = `display: ${display}`

        const fragment = new DocumentFragment()
        items.forEach( item => {
            const el = this.getElement(item)
            fragment.appendChild(el)

        })
        this.querySelector('.books').appendChild(fragment)
    }

    getElement(item) {
        const { author,
            description,
            discount,
            image,
            isbn,
            link,
            price,
            pubdate,
            publisher,
            title } = item
        const el = document.querySelector('[data-tp=book')
                    .content.firstElementChild.cloneNode(true)
        el.querySelector('.__author').textContent = `author: ${author}`
        el.querySelector('.__description').textContent = `${description}`
        el.querySelector('img').src = image
        // el.querySelector('.__isbn').textContent = `isbn: ${isbn}`
        el.querySelector('.__link').href = link
        el.querySelector('.__price').textContent = `price: ${price}`
        el.querySelector('.__pubdate').textContent = `pubdate: ${pubdate}`
        el.querySelector('.__publisher').textContent = `publisher: ${publisher}`
        el.querySelector('.__title').textContent = `title: ${title}`

        const isbn13 = isbn.split(' ')[0]
        this.addEvents(el, isbn13)
        return el
    }

    addEvents(el, isbn13) {
        const libCode = '111007'
        // el.querySelector('[data-button="search-lib"]')
        //     .addEventListener('click', () => {
                fetch(`/libSearch?isbn13=${isbn13}&libCode=${libCode}`, {
                    method: 'GET'
                })
                .then( data => data.json())
                .then( response => {
                    const { hasBook, loanAvailable } = response
                    el.querySelector('.__hasBook').textContent
                        = `소장: ${hasBook}`
                    el.querySelector('.__loanAvailable').textContent
                        = `대출: ${loanAvailable}`
                })
                .catch(e => {
                    console.log(e);
                });


            // })
    }



}