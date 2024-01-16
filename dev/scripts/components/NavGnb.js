import bookModel from "../model";
export default class NavGnb extends HTMLElement {
    constructor() {
        super();
        this.PATHS = [
            "/search",
            "/favorite",
            "/popular",
            "/library",
            "/setting",
        ];
        this.renderBookSize = this.renderBookSize.bind(this);
    }
    connectedCallback() {
        this.render();
        this.setSelectedMenu();
        bookModel.subscribeFavoriteBookUpdate(this.renderBookSize);
        bookModel.subscribeToBookStateUpdate(this.renderBookSize);
    }
    disconnectedCallback() {
        bookModel.unsubscribeFavoriteBookUpdate(this.renderBookSize);
        bookModel.unsubscribeFavoriteBookUpdate(this.renderBookSize);
        //
    }
    get bookSize() {
        return Object.values(bookModel.favorites).reduce((sum, currentArray) => sum + currentArray.length, 0);
    }
    render() {
        this.innerHTML = `
            <nav class="gnb">
                <a class="gnb-item" href=".${this.PATHS[0]}">책 검색</a>
                <a class="gnb-item" href=".${this.PATHS[1]}">나의 책 (<span class="size">${this.bookSize}</span>)</a>
                <a class="gnb-item" href=".${this.PATHS[2]}">인기대출도서</a>
                <a class="gnb-item" href=".${this.PATHS[3]}">도서관 조회</a>
                <a class="gnb-item" href=".${this.PATHS[4]}">설정</a>
            </nav>`;
    }
    setSelectedMenu() {
        const idx = this.PATHS.indexOf(document.location.pathname);
        if (idx >= 0)
            this.querySelectorAll("a")[idx].ariaSelected = "true";
    }
    renderBookSize() {
        const sizeEl = this.querySelector(".size");
        sizeEl.textContent = this.bookSize.toString();
    }
}
//# sourceMappingURL=NavGnb.js.map