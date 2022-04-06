
export default class BookList extends HTMLElement {
    constructor() {
        super()
        this.length = 0
    }

    set data(v) {
        this.render(v)
    }

    connectedCallback() {
        this.observer = new IntersectionObserver( changes => {
            changes.forEach( change => {
                if (change.isIntersecting) {
                    console.log('isIntersecting', change.target)
                    this.observer.unobserve(change.target)
                    fetch(`/naver?keyword=${encodeURIComponent(this.keyword)}&display=${10}&start=${this.length + 1}`, {
                        method: 'GET'
                    })
                    .then(data => data.json())
                    .then(response => {
                        this.data = response
                    })
                    .catch(e => {
                        console.log(e);
                    });
                        
                }
            })
        })

    }

    disconnectedCallback() {
    }

    render(data) {
        const books = this.querySelector('.books')

        const { total, start, display, items } = data
        this.querySelector('.__total').textContent = `total: ${total}`
        this.querySelector('.__start').textContent = `start: ${start}`
        this.querySelector('.__display').textContent = `display: ${display}`

        this.length = Number(start)-1 + Number(display)
        console.log(this.length)

        const fragment = new DocumentFragment()
        items.forEach( item => {
            const el = this.getElement(item)
            fragment.appendChild(el)

        })
        this.querySelector('.books').appendChild(fragment)
        
        const target = this.querySelector('.observe')
        this.observer.observe(target)

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
        el.querySelector('.__link').href = link
        el.querySelector('.__title').innerHTML = `${title}`
        el.querySelector('img').src = image
        el.querySelector('.__author').innerHTML = `author: ${author}`
        el.querySelector('.__description').innerHTML = `${description}`
        el.querySelector('.__isbn').innerHTML = `isbn: ${isbn}`
        el.querySelector('.__price').innerHTML = `price: ${price}`
        el.querySelector('.__pubdate').innerHTML = `pubdate: ${pubdate}`
        el.querySelector('.__publisher').innerHTML = `publisher: ${publisher}`

        const isbn13 = isbn.split(' ')[0]
        this.addEvents(el, isbn13)
        return el
    }

    addEvents(el, isbn13) {
        const libCode = '111007'
        el.querySelector('[data-button="search-lib"]')
            .addEventListener('click', () => {
                fetch(`/library-bookExist?isbn13=${isbn13}&libCode=${libCode}`, {
                    method: 'GET'
                })
                .then( data => data.json())
                .then( response => {
                    const { hasBook, loanAvailable } = response
                    const _hasBook = hasBook === 'Y' ? '소장' : '미소장'
                    el.querySelector('.__hasBook').textContent = `소장: ${_hasBook}`
                    if ( hasBook === 'Y' ) {
                        const _loan = loanAvailable === 'Y' ? '가능' : '불가'
                        el.querySelector('.__loanAvailable').textContent = `대출: ${_loan}`
                    }
                })
                .catch(e => {
                    console.log(e);
                });
            })
    }

    /*observer() {
        console.log('observe')
        this.observer = new IntersectionObserver( changes => {
            changes.forEach( change => {
                if (change.isIntersecting) {
                    console.log('isIntersecting')
                    // const isEnd = elements()
                    this.observer.unobserve(change.target)
                    // if (!isEnd) {
                        fetch(`/naver?keyword=${encodeURIComponent(keyword)}&display=${10}&start=${this.length + 1}`, {
                            method: 'GET'
                        })
                        .then(data => data.json())
                        .then(response => {
                            selectors.bookList.data = response
                        })
                        .catch(e => {
                            console.log(e);
                        });
                        const target = this.querySelector('.observe')
                        this.observer.observe(target)
                    // }
                }
            })
        })
    }
*/



}