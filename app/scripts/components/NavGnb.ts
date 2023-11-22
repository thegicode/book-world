import bookStore2 from "../modules/BookStore2";

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

        this.renderBookSize = this.renderBookSize.bind(this);
    }

    connectedCallback() {
        this.render();
        this.setSelectedMenu();

        bookStore2.subscribeBookUpdate(this.renderBookSize);
    }

    disconnectedCallback() {
        bookStore2.unsubscribeBookUpdate(this.renderBookSize);
        //
    }

    get bookSize() {
        return Object.values(bookStore2.getCategory()).reduce(
            (sum, currentArray: string[]) => sum + currentArray.length,
            0
        );
    }

    protected render() {
        const paths = this.PATHS;
        this.innerHTML = `
            <nav class="gnb">
                <a class="gnb-item" href=".${paths[0]}">책 검색</a>
                <a class="gnb-item" href=".${paths[1]}">나의 책 (<span class="size">${this.bookSize}</span>)</a>
                <a class="gnb-item" href=".${paths[2]}">인기대출도서</a>
                <a class="gnb-item" href=".${paths[3]}">도서관 조회</a>
                <a class="gnb-item" href=".${paths[4]}">설정</a>
            </nav>`;
    }

    protected setSelectedMenu(): void {
        const idx = this.PATHS.indexOf(document.location.pathname);
        if (idx >= 0) this.querySelectorAll("a")[idx].ariaSelected = "true";
    }

    protected renderBookSize() {
        const sizeEl = this.querySelector(".size") as HTMLElement;
        sizeEl.textContent = this.bookSize.toString();
    }
}
