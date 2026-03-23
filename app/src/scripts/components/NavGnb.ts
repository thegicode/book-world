import bookModel, { BookModelEvent } from "@/model";

export default class NavGnb extends HTMLElement {
    private PATHS: string[];
    private sizeElement: HTMLElement | null = null;

    constructor() {
        super();

        this.PATHS = [
            "/book-side",
            "/search",
            "/favorite",
            "/popular",
            "/library-search",
            "/setting",
        ];

        this.sizeElement = null;

        this.renderBookSize = this.renderBookSize.bind(this);
    }

    connectedCallback() {
        this.render();
        this.setSelectedMenu();

        this.sizeElement = this.querySelector(".size") as HTMLElement;

        bookModel
            .getPublisher(BookModelEvent.FavoriteBookUpdate)
            .subscribe(this.renderBookSize);
        bookModel
            .getPublisher(BookModelEvent.BookStateUpdate)
            .subscribe(this.renderBookSize);
    }

    disconnectedCallback() {
        bookModel
            .getPublisher(BookModelEvent.FavoriteBookUpdate)
            .unsubscribe(this.renderBookSize);
        bookModel
            .getPublisher(BookModelEvent.BookStateUpdate)
            .unsubscribe(this.renderBookSize);
    }

    get bookSize() {
        return Object.values(bookModel.favorites).reduce(
            (sum, currentArray: string[]) => sum + currentArray.length,
            0,
        );
    }

    protected render() {
        this.innerHTML = `
            <nav class="gnb">
                <a class="gnb-item" href=".${this.PATHS[0]}">책</a>
                <a class="gnb-item" href=".${this.PATHS[1]}">책 검색</a>
                <a class="gnb-item" href=".${this.PATHS[2]}">나의 책 (<span class="size">${this.bookSize}</span>)</a>
                <a class="gnb-item" href=".${this.PATHS[3]}">인기대출도서</a>
                <a class="gnb-item" href=".${this.PATHS[4]}">도서관 검색</a>
                <a class="gnb-item" href=".${this.PATHS[5]}">설정</a>
            </nav>`;
    }

    protected setSelectedMenu(): void {
        const index = this.PATHS.indexOf(document.location.pathname);
        if (index >= 0) {
            this.querySelectorAll("a")[index].setAttribute(
                "aria-current",
                "page",
            );
        }
    }

    protected renderBookSize() {
        if (this.sizeElement)
            this.sizeElement.textContent = this.bookSize.toString();
    }
}
