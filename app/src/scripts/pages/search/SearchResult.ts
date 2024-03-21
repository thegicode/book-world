import BookItem from "./BookItem";
import { Observer, CustomFetch } from "../../utils/index";
import { LoadingComponent } from "../../components";
import { URL } from "../../utils/constants";
import { fetchHTMLTemplate, parseHTMLTemplate } from "../../utils/helpers";

export default class SearchResult extends HTMLElement {
    private paginationElement!: HTMLElement;
    private bookContainer!: HTMLElement;
    private loadingComponent: LoadingComponent | null;
    private observer?: Observer;
    private keyword?: string;
    private sortingOrder?: string;
    private currentItemCount!: number;
    private observeTarget: HTMLElement;
    private itemsPerPage: number;
    private itemTemplate: HTMLTemplateElement;

    constructor() {
        super();

        this.paginationElement = this.querySelector(
            ".paging-info"
        ) as HTMLElement;
        this.bookContainer = this.querySelector(".books") as HTMLElement;
        this.loadingComponent =
            this.querySelector<LoadingComponent>("loading-component");
        this.observeTarget = this.querySelector(".observe") as HTMLElement;
        this.itemTemplate = document.createElement("template");

        this.itemsPerPage = 10;

        this.fetchBooks = this.fetchBooks.bind(this);
        this.initializeSearchPage = this.initializeSearchPage.bind(this);
    }

    async connectedCallback() {
        this.itemTemplate =
            (await this.fetchAndParseTemplate()) as HTMLTemplateElement;

        this.observer = new Observer(this.observeTarget, this.fetchBooks);
    }

    disconnectedCallback() {
        this.observer?.disconnect();
    }

    async initializeSearchPage(keyword: string, sortValue: string) {
        this.keyword = keyword;
        this.sortingOrder = sortValue;
        this.currentItemCount = 0;
        this.observer?.disconnect();

        // loadBooks: onSubmit으로 들어온 경우와 브라우저
        // showDefaultMessage: keyword 없을 때 기본 화면 노출, 브라우저
        this.keyword ? this.loadBooks() : this.showDefaultMessage();
    }

    private async fetchAndParseTemplate(): Promise<HTMLTemplateElement | null> {
        try {
            const html = await fetchHTMLTemplate(
                "./html/templates/book-item.html"
            );
            if (!html) return null;

            return parseHTMLTemplate(html);
        } catch (error) {
            console.error("Error fetching and parsing template:", error);
            return null;
        }
    }

    private loadBooks() {
        this.bookContainer.innerHTML = "";

        this.loadingComponent?.show();

        this.fetchBooks();

        this.loadingComponent?.hide();
    }

    private async fetchBooks() {
        if (!this.keyword || !this.sortingOrder) {
            return;
        }

        const searchUrl = `${URL.search}?keyword=${encodeURIComponent(
            this.keyword
        )}&display=${this.itemsPerPage}&start=${
            this.currentItemCount + 1
        }&sort=${this.sortingOrder}`;

        try {
            const data = await CustomFetch.fetch<ISearchNaverBookResult>(
                searchUrl
            );
            this.render(data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`Error fetching books: ${error.message}`);
            } else {
                console.error("An unexpected error occurred");
            }
        }
    }

    private render(bookData: ISearchNaverBookResult) {
        if (!bookData) return;

        if (bookData.total === 0) {
            this.renderMessage("notFound");
            return;
        }

        this.currentItemCount += bookData.display;
        this.updatePagingInfo(bookData.total);
        this.renderList(bookData.items);

        if (bookData.total !== this.currentItemCount) {
            this.observer?.observe();
        }
    }

    private updatePagingInfo(total: number) {
        const obj = {
            keyword: `${this.keyword}`,
            length: `${this.currentItemCount.toLocaleString()}`,
            total: `${total.toLocaleString()}`,
            display: `${this.itemsPerPage}개씩`,
        };

        for (const [key, value] of Object.entries(obj)) {
            const element = this.paginationElement.querySelector(
                `.__${key}`
            ) as HTMLElement;
            element.textContent = value;
        }
        this.paginationElement.hidden = false;
    }

    private renderList(searchBookData: ISearchBook[]) {
        const fragment = new DocumentFragment();

        searchBookData
            .map((data, index) => this.createItem(data, index))
            .forEach((bookItem) => fragment.appendChild(bookItem));

        this.bookContainer.appendChild(fragment);
    }

    private createItem(data: ISearchBook, index: number) {
        const bookItem = new BookItem(data, this.itemTemplate);
        bookItem.dataset.index = this.getIndex(index).toString();
        return bookItem;
    }

    private getIndex(index: number) {
        return (
            Math.ceil(
                (this.currentItemCount - this.itemsPerPage) / this.itemsPerPage
            ) *
                this.itemsPerPage +
            index
        );
    }

    private showDefaultMessage() {
        this.paginationElement.hidden = true;
        this.renderMessage("message");
    }

    private renderMessage(type: string) {
        const messageTemplate = document.querySelector(
            `#tp-${type}`
        ) as HTMLTemplateElement;
        if (!messageTemplate) return;

        this.bookContainer.innerHTML = "";
        this.bookContainer.appendChild(messageTemplate.content.cloneNode(true));
    }
}

// this.observer = new IntersectionObserver( changes => {
//     changes.forEach( change => {
//         if (change.isIntersecting) {
//             this.observer.unobserve(change.target)
//             this.fetchBooks()
//         }
//     })
// })
