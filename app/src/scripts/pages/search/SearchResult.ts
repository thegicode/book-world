import BookItem from "./BookItem";
import { Observer } from "../../utils/index";
import { URL } from "../../utils/constants";
import { FetchListComponent } from "../../components/FetchListComponent";

export default class SearchResult extends FetchListComponent<
    ISearchNaverBookResult,
    ISearchBook
> {
    private paginationElement!: HTMLElement;
    private observer?: Observer;
    private keyword?: string;
    private sortingOrder?: string;
    private observeTarget: HTMLElement;

    constructor() {
        super();
        this.paginationElement = this.querySelector(
            ".paging-info"
        ) as HTMLElement;
        this.observeTarget = this.querySelector(".observe") as HTMLElement;
        this.itemsPerPage = 10;
        this.initializeSearchPage = this.initializeSearchPage.bind(this);
    }

    async connectedCallback() {
        await this.loadTemplate("./html/templates/book-item.html");
        this.observer = new Observer(this.observeTarget, () =>
            this.loadMoreBooks()
        );
    }

    disconnectedCallback() {
        this.observer?.disconnect();
    }

    async initializeSearchPage(keyword: string, sortValue: string) {
        this.keyword = keyword;
        this.sortingOrder = sortValue;
        this.currentItemCount = 0;
        this.total = 0;
        this.listContainer.innerHTML = "";
        this.observer?.disconnect();

        if (this.keyword) {
            this.loadMoreBooks();
        } else {
            this.showDefaultMessage();
        }
    }

    private loadMoreBooks() {
        if (!this.keyword || !this.sortingOrder) {
            return;
        }
        const searchUrl = `${URL.search}?keyword=${encodeURIComponent(
            this.keyword
        )}&display=${this.itemsPerPage}&start=${
            this.currentItemCount + 1
        }&sort=${this.sortingOrder}`;

        this.fetchData(searchUrl);
    }

    // --- Implementation of abstract methods from FetchListComponent ---

    protected getItems(data: ISearchNaverBookResult): ISearchBook[] {
        return data.items;
    }

    protected getTotal(data: ISearchNaverBookResult): number {
        return data.total;
    }

    protected createItem(data: ISearchBook, index: number): HTMLElement | null {
        if (!this.itemTemplate) return null;
        const bookItem = new BookItem(data, this.itemTemplate);
        bookItem.dataset.index = this.getGlobalIndex(index).toString();
        return bookItem;
    }

    protected onRenderComplete() {
        this.updatePagingInfo();
        if (this.total > this.currentItemCount) {
            this.observer?.observe();
        }
    }

    // --- Helper methods specific to SearchResult ---

    private getGlobalIndex(index: number): number {
        const page = Math.ceil(
            (this.currentItemCount - this.itemsPerPage) / this.itemsPerPage
        );
        return page * this.itemsPerPage + index;
    }

    private updatePagingInfo() {
        if (!this.keyword) return;

        const obj = {
            keyword: `${this.keyword}`,
            length: `${this.currentItemCount.toLocaleString()}`,
            total: `${this.total.toLocaleString()}`,
            display: `${this.itemsPerPage}개씩`,
        };

        for (const [key, value] of Object.entries(obj)) {
            const element = this.paginationElement.querySelector(
                `.__${key}`
            ) as HTMLElement;
            if (element) element.textContent = value;
        }
        this.paginationElement.hidden = false;
    }

    private showDefaultMessage() {
        this.paginationElement.hidden = true;
        this.renderMessage("message");
    }
}