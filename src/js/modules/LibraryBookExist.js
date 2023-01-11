// import newCustomEvent from "./NewCustomEvent.js"

export default class LibraryBookExist extends HTMLElement {
    constructor() {
        super()
        this.root = this.querySelector('.favorite-library')
    }

    connectedCallback() {
    }

    disconnectedCallback() {
    }

    onLibraryBookExist(button, isbn13, library) {
        const template = document.querySelector('[data-template=library-item]')
        this.loading()
        button.remove()
        for (const [libCode, libName] of Object.entries(library)) {
            fetch(`/library-bookExist?isbn13=${isbn13}&libCode=${libCode}`, {
                method: 'GET'
            })
            .then(data => data.json())
            .then(response => {
                const { hasBook, loanAvailable} = response
                const _hasBook = hasBook === 'Y' ? '소장' : '미소장'
                const _loanAvailable = loanAvailable === 'Y' ? '대출가능' : '대출불가'
                const el = template.content.firstElementChild.cloneNode(true)
                el.querySelector('.name').textContent = libName
                el.querySelector('.hasBook').textContent = _hasBook
                el.querySelector('.loanAvailable').textContent = _loanAvailable
                this.removeLoading()
                this.root.appendChild(el)
            })
            .catch(e => {
                console.log(e);
            });
        }
    }

    loading() {
        this.root.dataset.loading = true
    }

    removeLoading() {
        const loading = this.root.querySelector('.loading')
        if (loading)
            this.root.querySelector('.loading').remove()
        this.root.removeAttribute('data-loading')
    }

}