// import newCustomEvent from "./NewCustomEvent.js"

export default class LibraryBookExist extends HTMLElement {
    constructor() {
        super()
        this.root = this.querySelector('.library-list')
    }

    connectedCallback() {
        this.itemTemplate = this.template()
    }

    disconnectedCallback() {
    }

    onLibraryBookExist(button, isbn13, library) {
        const entries = Object.entries(library)
        this.loading(entries.length)
        if (button) {
            button.disabled = true
        }

        const promises = entries.map( async ([libCode, libName], index) => {
            try {
                const response = await fetch(`/book-exist?isbn13=${isbn13}&libCode=${libCode}`)
                const data = await response.json()
                this.renderBookExist(data, libName, index)
            } catch(error) {
                console.error(error)
                throw error
            }
        })

        Promise.all(promises)
            .then( () => {
                this.removeLoading()
            })
            .catch( () => {
                console.error('Failed to fetch data for some libraries')
            })
    }

    renderBookExist(data, libName, index) {
        const {hasBook, loanAvailable} = data
        const _hasBook = hasBook === 'Y' ? '소장, ' : '미소장'
        let _loanAvailable = ''
        if (hasBook === 'Y') {
            _loanAvailable = loanAvailable === 'Y' ? '대출가능' : '대출불가'
        }
        const el = this.querySelectorAll('.library-item')[index]
        el.querySelector('.name').textContent = `☼ ${libName} : `
        el.querySelector('.hasBook').textContent = _hasBook
        el.querySelector('.loanAvailable').textContent = _loanAvailable
    }

    loading(size) {
        let tp = ''
        while(size > 0) {
            tp += this.itemTemplate
            size--
        }
        this.root.innerHTML = tp
    }

    removeLoading() {
        const loadingItems = this.querySelectorAll('.library-item[data-loading=true]');
        loadingItems.forEach(el => {
            delete el.dataset.loading
        })
    }

    template() {
        return `<li class="library-item" data-loading="true">
            <span class="name"></span>
            <span class="hasBook"></span>
            <span class="loanAvailable"></span>
        </li>`
    }
    
}