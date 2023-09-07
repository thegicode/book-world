import { state } from "../modules/model";

export default class NavGnb extends HTMLElement {
    protected favoriteBooksSize: number;

    constructor() {
        super();
        this.favoriteBooksSize = this.getFavoriteBooksSize();
    }

    connectedCallback() {
        this.render();
        this.setSelectedMenu();
    }

    disconnectedCallback() {
        //
    }

    protected getFavoriteBooksSize(): number {
        function getTotalItemCount(data: Record<string, string[]>) {
            return Object.values(data).reduce(
                (sum, currentArray: string[]) => sum + currentArray.length,
                0
            );
        }
        return getTotalItemCount(state.category);
    }

    protected render() {
        this.innerHTML = `
            <nav class="gnb">
                <a class="gnb-item" href="./search">책 검색</a>
                <a class="gnb-item" href="./favorite">나의 책 (<span class="size">${this.favoriteBooksSize}</span>)</a>
                <a class="gnb-item" href="./library">도서관 조회</a>
                <a class="gnb-item" href="./setting">설정</a>
            </nav>`;
    }

    protected setSelectedMenu(): void {
        const PATHS = ["/search", "/favorite", "/library", "/setting"];
        const idx = PATHS.indexOf(document.location.pathname);
        if (idx >= 0) this.querySelectorAll("a")[idx].ariaSelected = "true";
    }

    // protected updateFavoriteBooksSize(event: Event): void {
    //     const customEvent = event as CustomEvent<{ size: number }>
    //     const { size } = customEvent.detail
    //     this.querySelector('.size')!.textContent = String(size || this.getFavoriteBooksSize())
    // }
}
