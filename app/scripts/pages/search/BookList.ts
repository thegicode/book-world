import BookItem from "./BookItem";
import { Observer, CustomFetch } from "../../utils/index";
import { LoadingComponent } from "../../components";
// import { SEARCH_PAGE_INIT } from "./constant";
import { URL } from "../../utils/constants";
import { cloneTemplate } from "../../utils/helpers";

export default class BookList extends HTMLElement {
    paginationElement!: HTMLElement;
    bookContainer!: HTMLElement;
    loadingComponent: LoadingComponent | null;
    observer?: Observer;
    keyword?: string;
    sortingOrder?: string;
    itemCount!: number;

    constructor() {
        super();

        this.paginationElement = this.querySelector(
            ".paging-info"
        ) as HTMLElement;
        this.bookContainer = this.querySelector(".books") as HTMLElement;
        this.loadingComponent =
            this.querySelector<LoadingComponent>("loading-component");

        this.retrieveBooks = this.retrieveBooks.bind(this);
        this.initializeSearchPage = this.initializeSearchPage.bind(this);
    }

    connectedCallback() {
        this.setupObserver();

        // CustomEventEmitter.add(
        //     SEARCH_PAGE_INIT,
        //     this.initializeSearchPage as EventListener
        // );
    }

    disconnectedCallback() {
        this.observer?.disconnect();

        // CustomEventEmitter.remove(
        //     SEARCH_PAGE_INIT,
        //     this.initializeSearchPage as EventListener
        // );
    }

    initializeSearchPage(keyword: string, sortValue: string) {
        this.keyword = keyword;
        this.sortingOrder = sortValue;
        this.itemCount = 0;

        // renderBooks: onSubmit으로 들어온 경우와 브라우저
        // showDefaultMessage: keyword 없을 때 기본 화면 노출, 브라우저
        this.keyword ? this.renderBooks() : this.showDefaultMessage();
    }

    // initializeSearchPage(
    //     event: ICustomEvent<{
    //         keyword: string;
    //         sort: string;
    //     }>
    // ) {
    //     const { keyword, sort } = event.detail;

    //     this.keyword = keyword;
    //     this.sortingOrder = sort;
    //     this.itemCount = 0;

    //     // renderBooks: onSubmit으로 들어온 경우와 브라우저
    //     // showDefaultMessage: keyword 없을 때 기본 화면 노출, 브라우저
    //     this.keyword ? this.renderBooks() : this.showDefaultMessage();
    // }

    private setupObserver() {
        const target = this.querySelector(".observe") as HTMLElement;
        this.observer = new Observer(target, this.retrieveBooks);
    }

    private renderBooks() {
        this.bookContainer.innerHTML = "";
        this.retrieveBooks();
    }

    private showDefaultMessage() {
        this.paginationElement.hidden = true;
        this.renderMessage("message");
    }

    private async retrieveBooks(): Promise<void> {
        if (!this.keyword || !this.sortingOrder) return;

        this.loadingComponent?.show();

        const encodedKeyword = encodeURIComponent(this.keyword);
        const searchUrl = `${
            URL.search
        }?keyword=${encodedKeyword}&display=${10}&start=${
            this.itemCount + 1
        }&sort=${this.sortingOrder}`;

        // console.log("fetch-search: ", searchUrl);

        try {
            const data = await CustomFetch.fetch<ISearchNaverBookResult>(
                searchUrl
            );
            this.renderBookList(data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`Error fetching books: ${error.message}`);
            } else {
                console.error("An unexpected error occurred");
            }
        }

        this.loadingComponent?.hide();
    }

    private renderBookList({
        total,
        display,
        items,
    }: ISearchNaverBookResult): void {
        if (total === 0) {
            this.renderMessage("notFound");
            return;
        }

        this.itemCount += display;
        this.refreshPagingData(total, display);
        this.appendBookItems(items);
        this.paginationElement.hidden = false;

        if (total !== this.itemCount) this.observer?.observe();
    }

    private refreshPagingData(total: number, display: number) {
        const obj = {
            keyword: `${this.keyword}`,
            length: `${this.itemCount.toLocaleString()}`,
            total: `${total.toLocaleString()}`,
            display: `${display}개씩`,
        };

        for (const [key, value] of Object.entries(obj)) {
            const element = this.paginationElement.querySelector(
                `.__${key}`
            ) as HTMLElement;
            element.textContent = value;
        }
    }

    private appendBookItems(items: ISearchBook[]) {
        const fragment = new DocumentFragment();
        const template = document.querySelector(
            "#tp-book-item"
        ) as HTMLTemplateElement;

        items.forEach((item, index) => {
            const bookItem = cloneTemplate(template) as BookItem;
            bookItem.data = item;
            bookItem.dataset.index = (this.itemCount + index).toString();
            fragment.appendChild(bookItem);
        });

        this.bookContainer.appendChild(fragment);
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
//             this.retrieveBooks()
//         }
//     })
// })
