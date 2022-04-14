import model from '../model.js'

const models = model()
const  { state, addFavorite, deleteFavorite } = models

export default class BookItem extends HTMLElement {
    constructor() {
        super()
        this.favoriteButton = this.querySelector('input[name="favorite"]')
    }

    connectedCallback() {
        this.render()

        this.favoriteButton.addEventListener('change', this.onFavorite.bind(this))
        // this.libraryButton.addEventListener('click', this.onClick.bind(this))
    }

    disConnectedCallback() {
        this.favoriteButton.removeEventListener('change', this.onFavorite.bind(this))
        // this.libraryButton.removeEventListener('click', this.onClick.bind(this))
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

        const obj = {
            title: `${title}`,
            author: `${author}`,
            description: `${description}`,
            price: `가격: ${Number(price).toLocaleString()}원`,
            pubdate: `출판일: ${pubdate}`,
            publisher: `출판사: ${publisher}`,
            isbn: `isbn: ${isbn.split(' ').join(', ')}`
        }
        for (const [key, value] of Object.entries(obj)) {
            this.querySelector(`.__${key}`).innerHTML = value
        }

        this.querySelector('.__link').href = link
        this.querySelector('img').src = image

        this.dataset.index = this.index
        this.isbn13 = isbn.split(' ')[0]


        const { favorite } = state
        if (favorite.includes(this.isbn13)) {
            this.favoriteButton.checked = true
        }
    }

    // onClick() {
    //     const hasBookEl = this.querySelector('.__hasBook')
    //     const loanAvailableEl = this.querySelector('.__loanAvailable')
    //     const libCode = '111007'
    //     fetch(`/library-bookExist?isbn13=${this.isbn13}&libCode=${libCode}`, {
    //         method: 'GET'
    //     })
    //     .then( data => data.json())
    //     .then( response => {
    //         const { hasBook, loanAvailable } = response
    //         const _hasBook = hasBook === 'Y' ? '소장' : '미소장'
    //         hasBookEl.textContent = `소장: ${_hasBook}`
    //         if ( hasBook === 'Y' ) {
    //             const _loan = loanAvailable === 'Y' ? '가능' : '불가'
    //             loanAvailableEl.textContent = `대출: ${_loan}`
    //         }
    //     })
    //     .catch(e => {
    //         console.log(e);
    //     });
    // }


    onFavorite(event) {
        const { checked } = event.target
        if (checked) {
            addFavorite(this.isbn13)
        } else {
            deleteFavorite(this.isbn13)
        }
    }

}

