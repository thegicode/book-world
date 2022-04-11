
export default class BookItem extends HTMLElement {
    constructor() {
        super()
        this.libraryButton = this.querySelector('[data-button="search-library"]')
        this.favoriteButton = this.querySelector('[data-button="favorite"')
    }

    connectedCallback() {
        this.render()
        this.libraryButton.addEventListener('click', this.onClick.bind(this))
        this.favoriteButton.addEventListener('click', this.onFavorite.bind(this))
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

        const { favorite } = JSON.parse(this.store)
        if (favorite.includes(this.isbn13)) {
            this.favoriteButton.dataset.selected = true
        }
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


    onFavorite() {
        // console.log(this.isbn13)
        let BookWorld = JSON.parse(localStorage.getItem('BookWorld'))
        if (BookWorld === null) {
            BookWorld = {
                favorite: [this.isbn13]
            }
        }
        if (BookWorld.favorite.includes(this.isbn13) !== true) {
            BookWorld.favorite.push(this.isbn13)
        } 
        localStorage.setItem('BookWorld', JSON.stringify(BookWorld))
        this.favoriteButton.dataset.selected = true
    }

}