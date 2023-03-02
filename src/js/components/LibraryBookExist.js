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
        const data = Object.entries(library)
        this.loading(data.length)
        button.disabled = true
        data.map(([libCode, libName], index) => {
            fetch(`/library-bookExist?isbn13=${isbn13}&libCode=${libCode}`, {
                method:'GET'
            })
            .then(data => data.json())
            .then(response => {
                const el = this.querySelectorAll('.library-item')[index]
                const { hasBook, loanAvailable} = response
                const _hasBook = hasBook === 'Y' ? '소장, ' : '미소장'
                let _loanAvailable = ''
                if (hasBook === 'Y') {
                    _loanAvailable = loanAvailable === 'Y' ? '대출가능' : '대출불가'
                }
                el.querySelector('.name').textContent = `☼ ${libName} : `
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
        let tp = ''
        while(size > 0) {
            tp += this.itemTemplate
            size--
        }
        this.root.innerHTML = tp
    }

    removeLoading(el) {
        delete el.dataset.loading
    }

    template() {
        return `<li class="library-item" data-loading="true">
            <span class="name"></span>
            <span class="hasBook"></span>
            <span class="loanAvailable"></span>
        </li>`
    }
    
}