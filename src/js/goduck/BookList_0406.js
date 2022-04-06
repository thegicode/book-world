
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

        // const { total, start, display, items } = data
        // this.querySelector('.__total').textContent = `total: ${total}`
        // this.querySelector('.__start').textContent = `start: ${start}`
        // this.querySelector('.__display').textContent = `display: ${display}`

        const fragment = new DocumentFragment()
        data.forEach( item => {
            const el = this.getElement(item)
            fragment.appendChild(el)

        })
        this.querySelector('.books').appendChild(fragment)
    }

    getElement(item) {
        console.log(item.doc)
        const { authors,
            bookname,
            isbn13,
            loan_count,
            publication_date,
            publisher,
            vol } = item.doc
        const el = document.querySelector('[data-template=book')
                    .content.firstElementChild.cloneNode(true)

                    
        el.querySelector('.__authors').textContent = `authors: ${authors}`
        el.querySelector('.__bookname').textContent = `${bookname}`
        // el.querySelector('img').src = image
        el.querySelector('.__isbn13').textContent = `isbn13: ${isbn13}`
        // el.querySelector('.__link').href = link
        el.querySelector('.__loan_count').textContent = `loan_count: ${loan_count}`
        el.querySelector('.__publication_date').textContent = `publication_date: ${publication_date}`
        // el.querySelector('.__publisher').textContent = `publisher: ${publisher}`
        // el.querySelector('.__title').textContent = `title: ${title}`

        // const isbn13 = isbn.split(' ')[0]
        // this.addEvents(el, isbn13)
        return el
    }

    addEvents(el, isbn13) {
        const libCode = '111007'
        // el.querySelector('[data-button="search-lib"]')
        //     .addEventListener('click', () => {
                fetch(`/library-bookExist?isbn13=${isbn13}&libCode=${libCode}`, {
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