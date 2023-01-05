
class LibraryBookExist {
    constructor(root, button, template, isbn13, library) {
        this.root = root
        this.button = button
        this.template = template
        this.isbn13 = isbn13
        this.library = library
        this.start()
    }

    start() {
        this.loading()
        this.button.remove()
        for (const [libCode, libName] of Object.entries(this.library)) {
            fetch(`/library-bookExist?isbn13=${this.isbn13}&libCode=${libCode}`, {
                method: 'GET'
            })
            .then(data => data.json())
            .then(response => {
                const { hasBook, loanAvailable} = response
                const _hasBook = hasBook === 'Y' ? '소장' : '미소장'
                const _loanAvailable = loanAvailable === 'Y' ? '대출가능' : '대출불가'
                const el = this.template.content.firstElementChild.cloneNode(true)
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

export default LibraryBookExist