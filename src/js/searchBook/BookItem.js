
import model from '../model.js'
const  { state, addFavorite, deleteFavorite, includesFavorite } = model

export default class BookItem extends HTMLElement {
    constructor() {
        super()
        this.favoriteButton = this.querySelector('input[name="favorite"]')
        this.libraryButton = this.querySelector('.library-button')
        this.library = this.querySelector('.favorite-library')
        this.libraryItemTemplate = document.querySelector('#tp-libraryItem')
    }

    connectedCallback() {
        this.render()

        this.favoriteButton.addEventListener('change', this.onFavorite.bind(this))
        this.libraryButton.addEventListener('click', this.onLibrary.bind(this))
    }

    disConnectedCallback() {
        this.favoriteButton.removeEventListener('change', this.onFavorite.bind(this))
        this.libraryButton.removeEventListener('click', this.onLibrary.bind(this))
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

        const yyyy = pubdate.substring(0,4)
        const dd = pubdate.substring(pubdate.length - 2, pubdate.length)
        const mm = (pubdate.length === 7) ? `0${pubdate.substring(4, 5)}` : pubdate.substring(4, 6)
        const _date = `${yyyy}.${mm}.${dd}`

        const obj = {
            title: `${title}`,
            author: `${author}`,
            description: `${description}`,
            price: `${Number(price).toLocaleString()}원`,
            publisher: `${publisher}`,
            pubdate: `${_date}`,
            isbn: `isbn : ${isbn.split(' ').join(', ')}`
        }
        for (const [key, value] of Object.entries(obj)) {
            this.querySelector(`.__${key}`).innerHTML = value
        }

        this.querySelector('.__link').href = link

        const img = this.querySelector('img')
        img.src = image
        img.onerror = () => {
            this.querySelector('.__thumb').dataset.fail = true
            console.error('image fail', image)
            img.remove()
        }

        this.dataset.index = this.index
        this.isbn13 = isbn.split(' ')[0]

        const { favorite } = state
        if (includesFavorite(this.isbn13)) {
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

    onLibrary() {
        this.libraryLoading()
        this.libraryButton.remove()
        for (const [libCode, libName] of Object.entries(state.library)) {
            fetch(`/library-bookExist?isbn13=${this.isbn13}&libCode=${libCode}`, {
                method: 'GET'
            })
            .then(data => data.json())
            .then(response => {
                const { hasBook, loanAvailable} = response
                const _hasBook = hasBook === 'Y' ? '소장' : '미소장'
                const _loanAvailable = loanAvailable === 'Y' ? '대출가능' : '대출불가'
                const el = this.libraryItemTemplate.content.firstElementChild.cloneNode(true)
                el.querySelector('.name').textContent = libName
                el.querySelector('.hasBook').textContent = _hasBook
                el.querySelector('.loanAvailable').textContent = _loanAvailable
                this.removeLibraryLoading()
                this.library.appendChild(el)
            })
            .catch(e => {
                console.log(e);
            });
        }
    }

    libraryLoading() {
        this.library.dataset.loading = true
    }
    removeLibraryLoading() {
        const loading = this.library.querySelector('.loading')
        if (loading)
            this.library.querySelector('.loading').remove()
        this.library.removeAttribute('data-loading')
    }

}

