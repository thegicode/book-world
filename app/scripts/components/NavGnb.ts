import { getBookSizeInCategory } from "../modules/model";

export default class NavGnb extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.setSelectedMenu();
    }

    protected render() {
        this.innerHTML = `
            <nav class="gnb">
                <a class="gnb-item" href="./search">책 검색</a>
                <a class="gnb-item" href="./favorite">나의 책 (<span class="size">${getBookSizeInCategory()}</span>)</a>
                <a class="gnb-item" href="./library">도서관 조회</a>
                <a class="gnb-item" href="./popular">인기대출도서</a>
                <a class="gnb-item" href="./setting">설정</a>
            </nav>`;
    }

    protected setSelectedMenu(): void {
        const PATHS = [
            "/search",
            "/favorite",
            "/library",
            "/popular",
            "/setting",
        ];
        const idx = PATHS.indexOf(document.location.pathname);
        if (idx >= 0) this.querySelectorAll("a")[idx].ariaSelected = "true";
    }
}
