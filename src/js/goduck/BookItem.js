
export default class BookItem extends HTMLElement {
    constructor() {
        super()
        this.libraryButton = this.querySelector('[data-button="search-library"]')
    }

    connectedCallback() {
        this.render()
        this.libraryButton.addEventListener('click', this.onClick.bind(this))
    }
    
    disConnectedCallback() {
        this.libraryButton.removeEventListener('click', this.onClick.bind(this))
    }

    render() {
        const { author,
            description,
            discount,
            image,
            isbn,
            link,
            price,
            pubdate,
            publisher,
            title } = this.data
        this.querySelector('.__link').href = link
        this.querySelector('.__title').innerHTML = `${title}`
        this.querySelector('img').src = image
        this.querySelector('.__author').innerHTML = `작가: ${author}`
        this.querySelector('.__description').innerHTML = `${description}`
        this.querySelector('.__price').innerHTML = `가격: ${Number(price).toLocaleString()}`
        this.querySelector('.__pubdate').innerHTML = `출판일: ${pubdate}`
        this.querySelector('.__publisher').innerHTML = `출판사: ${publisher}`
        this.querySelector('.__isbn').innerHTML = `isbn: ${isbn.split(' ').join(', ')}`

        this.dataset.index = this.index
        this.isbn13 = isbn.split(' ')[0]
    }

    onClick() {
        const libCode = '111007'
        fetch(`/library-bookExist?isbn13=${this.isbn13}&libCode=${libCode}`, {
            method: 'GET'
        })
        .then( data => data.json())
        .then( response => {
            const { hasBook, loanAvailable } = response
            const _hasBook = hasBook === 'Y' ? '소장' : '미소장'
            this.querySelector('.__hasBook').textContent = `소장: ${_hasBook}`
            if ( hasBook === 'Y' ) {
                const _loan = loanAvailable === 'Y' ? '가능' : '불가'
                this.querySelector('.__loanAvailable').textContent = `대출: ${_loan}`
            }
        })
        .catch(e => {
            console.log(e);
        });
    }

}