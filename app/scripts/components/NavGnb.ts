import store from "../modules/store";

export default class NavGnb extends HTMLElement {
    PATHS: string[];

    constructor() {
        super();

        this.PATHS = [
            "/search",
            "/favorite",
            "/popular",
            "/library",
            "/setting",
        ];
    }

    connectedCallback() {
        this.render();
        this.setSelectedMenu();
    }

    protected render() {
        const paths = this.PATHS;
        this.innerHTML = `
            <nav class="gnb">
                <a class="gnb-item" href=".${paths[0]}">책 검색</a>
                <a class="gnb-item" href=".${
                    paths[1]
                }">나의 책 (<span class="size">${store.getBookSizeInCategory()}</span>)</a>
                <a class="gnb-item" href=".${paths[2]}">인기대출도서</a>
                <a class="gnb-item" href=".${paths[3]}">도서관 조회</a>
                <a class="gnb-item" href=".${paths[4]}">설정</a>
            </nav>`;
    }

    protected setSelectedMenu(): void {
        const idx = this.PATHS.indexOf(document.location.pathname);
        if (idx >= 0) this.querySelectorAll("a")[idx].ariaSelected = "true";
    }
}
