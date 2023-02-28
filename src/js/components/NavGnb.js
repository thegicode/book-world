
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
        this.innerHTML =  `
            <nav class="gnb">
                <a class="gnb-item" href="./search">책 검색</a>
                <a class="gnb-item" href="./favorite">즐겨찾기</a>
                <a class="gnb-item" href="./library">도서관 조회</a>
            </nav>`
    }
    
    activate() {
        const paths = ['/search', '/favorite', '/library']
        const idx = paths.indexOf(document.location.pathname)
        if (idx >=0 )
            this.querySelectorAll('a')[idx].ariaSelected = true
    }
}