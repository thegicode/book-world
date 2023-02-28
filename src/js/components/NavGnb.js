
export default class NavGnb extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.render()
        this.activate()
    }

    disconnectedCallback() {
    }

    render() {
        const template = `
            <nav class="gnb">
                <a class="gnb-item" href="./search">책 검색</a>
                <a class="gnb-item" href="./favorite">즐겨찾기</a>
                <a class="gnb-item" href="./library">도서관 조회</a>
            </nav>`
        this.innerHTML = template
    }
    
    activate() {
        const paths = ['/search', '/favorite', '/library']
        const idx = paths.indexOf(document.location.pathname)
        this.querySelectorAll('a')[idx].ariaSelected = true
    }
}