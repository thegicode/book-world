import { getState } from "../modules/model";
export default class NavGnb extends HTMLElement {
    constructor() {
        super();
        this.favoriteBooksSize = this.getFavoriteBooksSize();
    }
    connectedCallback() {
        this.render();
        this.setSelectedMenu();
        // CustomEventEmitter.add('favorite-books-changed', this.updateFavoriteBooksSize.bind(this))
    }
    disconnectedCallback() {
        // CustomEventEmitter.remove('favorite-books-changed', this.updateFavoriteBooksSize)
    }
    getFavoriteBooksSize() {
        return getState().favoriteBooks.length;
    }
    render() {
        this.innerHTML = `
            <nav class="gnb">
                <a class="gnb-item" href="./search">책 검색</a>
                <a class="gnb-item" href="./favorite">나의 책 (<span class="size">${this.favoriteBooksSize}</span>)</a>
                <a class="gnb-item" href="./library">도서관 조회</a>
                <a class="gnb-item" href="./setting">설정</a>
            </nav>`;
    }
    setSelectedMenu() {
        const PATHS = ["/search", "/favorite", "/library", "/setting"];
        const idx = PATHS.indexOf(document.location.pathname);
        if (idx >= 0)
            this.querySelectorAll("a")[idx].ariaSelected = "true";
    }
}
//# sourceMappingURL=NavGnb.js.map