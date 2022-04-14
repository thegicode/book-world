
export default class Favorite extends HTMLElement {
    constructor() {
        super()
        this.store = JSON.parse(localStorage.getItem('BookWorld')) || {favorite: []}
    }

    connectedCallback() {
        this.render()
        this.store.favorite.forEach( (isbn13) => {
            this.request(isbn13)
        })
    }

    disConnectedCallback() {
        this.favoriteButton.removeEventListener('click', this.onFavorite.bind(this))
    }

    render() {
        this.querySelector('.count')
            .textContent = `${this.store.favorite.length}권`
    }

    request(isbn13) {
        fetch(`/usageAnalysisList?isbn13=${isbn13}`, {
            method: 'GET'
        })
        .then(data => data.json())
        .then(response => {
            this.elements(response)
        })
        .catch(e => {
            console.log(e);
        });
    }

    elements(data)  {
        const el = document.querySelector('[data-template=favorite-item]').content.firstElementChild.cloneNode(true)
        this.renderItem(el, data)
        this.querySelector('.favorite-books').appendChild(el)
    }

    renderItem(el, data) {
        const { 
            book, 
            loanHistory,
            loanGrps,
            keywords,
            recBooks,
            coLoanBooks
        } = data

        const {
            authors,
            bookImageURL,
            bookname,
            class_nm,
            class_no,
            description,
            isbn13,
            loanCnt,
            publication_year,
            publisher,
            vol
        } = book

        const obj = {
            bookname: `${bookname}`,
            authors: `${authors}`,
            class_nm: `${class_nm}`,
            class_no: `${class_no}`,
            isbn13: `${isbn13}`,
            loanCnt: `${loanCnt}`,
            publication_year: `${publication_year}`,
            publisher: `${publisher}`,
            vol: `${vol}`,
        }
        for (const [key, value] of Object.entries(obj)) {
            el.querySelector(`.${key}`).textContent = value
        }
        el.querySelector('img').src = bookImageURL
        el.querySelector('.description').innerHTML = description
        el.querySelector('.favorite-button')
            .addEventListener('click', this.onFavorite.bind(this))
    }

    renderLoanHistory(el, data) {
        const fragemnt = new DocumentFragment()
        data.forEach( item => {
            const elLoan = document.querySelector('[data-template=history-item]').content.firstElementChild.cloneNode(true)
            const { month, loanCnt, ranking } = item
            elLoan.querySelector('.month').textContent = month
            elLoan.querySelector('.loanCnt').textContent = loanCnt
            elLoan.querySelector('.ranking').textContent = ranking
            fragemnt.appendChild(elLoan)
        })
        el.querySelector('.loanHistory ul').appendChild(fragemnt)

    }

    onFavorite(event) {
        const { favorite } = this.store
        const index = favorite.indexOf(this.isbn13)
        favorite.splice(index, 1)
        localStorage.setItem('BookWorld', JSON.stringify(this.store))
        event.target.closest('.item').remove()
    }

}

