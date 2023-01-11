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
        const size = Object.keys(library).length
        this.loading(size)
        button.remove()
        Object.entries(library).map(([libCode, libName], index) => {
            fetch(`/library-bookExist?isbn13=${isbn13}&libCode=${libCode}`, {
                method:'GET'
            })
            .then(data => data.json())
            .then(response => {
                const el = this.root.querySelectorAll('.library-item')[index]
                const { hasBook, loanAvailable} = response
                const _hasBook = hasBook === 'Y' ? '소장, ' : '미소장'
                let _loanAvailable = ''
                if (hasBook === 'Y') {
                    _loanAvailable = loanAvailable === 'Y' ? '대출가능' : '대출불가'
                }
                el.querySelector('.name').textContent = `${libName} : `
                el.querySelector('.hasBook').textContent = _hasBook
                el.querySelector('.loanAvailable').textContent = _loanAvailable
                this.removeLoading(el)
            })
            .catch(e => {
                console.log(e);
            });
        })
    }

    loading(size) {
        const tp = document.querySelector('[data-template=library-item]')
                    .content
                    .firstElementChild
        while(size > 0) {
            const el = tp.cloneNode(true)
            this.root.appendChild(el)
            size--
        }
    }

    removeLoading(el) {
        delete el.dataset.loading
    }

}