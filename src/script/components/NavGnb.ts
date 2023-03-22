import { getState } from "../modules/model.js";

export default class NavGnb extends HTMLElement {
    private favoriteBooksSize: number;

    constructor() {
        super();
        this.favoriteBooksSize = this.getFavoriteBooksSize();
    }

    connectedCallback(): void {
        this.render();
        this.setSelectedMenu();
        // CustomEventEmitter.add('favorite-books-changed', this.updateFavoriteBooksSize.bind(this))
    }

    disconnectedCallback(): void {
        // CustomEventEmitter.remove('favorite-books-changed', this.updateFavoriteBooksSize)
    }

    private getFavoriteBooksSize(): number {
        return getState().favoriteBooks.length;
    }

    private render(): void {
        this.innerHTML = `
            <nav class="gnb">
                <a class="gnb-item" href="./search">책 검색</a>
                <a class="gnb-item" href="./favorite">나의 책 (<span class="size">${this.favoriteBooksSize}</span>)</a>
                <a class="gnb-item" href="./library">도서관 조회</a>
                <a class="gnb-item" href="./setting">설정</a>
            </nav>`;
    }

    private setSelectedMenu(): void {
        const PATHS = ["/search", "/favorite", "/library", "/setting"];
        const idx = PATHS.indexOf(document.location.pathname);
        if (idx >= 0) this.querySelectorAll("a")[idx].ariaSelected = "true";
    }

    // private updateFavoriteBooksSize(event: Event): void {
    //     const customEvent = event as CustomEvent<{ size: number }>
    //     const { size } = customEvent.detail
    //     this.querySelector('.size')!.textContent = String(size || this.getFavoriteBooksSize())
    // }
}
