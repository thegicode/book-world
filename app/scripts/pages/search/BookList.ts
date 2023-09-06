import BookItem from "./BookItem";
import { Observer, CustomFetch, CustomEventEmitter } from "../../utils/index";

export default class BookList extends HTMLElement {
    pagingInfo!: HTMLElement;
    books!: HTMLElement;
    observer?: Observer;
    keyword?: string;
    sort?: string;
    length!: number;

    constructor() {
        super();
        this.initializeProperties();
        this.bindMethods();
    }

    private initializeProperties(): void {
        this.pagingInfo = this.querySelector(".paging-info") as HTMLElement;
        this.books = this.querySelector(".books") as HTMLElement;
    }

    private bindMethods(): void {
        this.fetchSearchNaverBook = this.fetchSearchNaverBook.bind(this);
    }

    connectedCallback() {
        this.setupObserver();
        CustomEventEmitter.add(
            "search-page-init",
            this.onSearchPageInit.bind(this)
        );
    }

    disconnectedCallback() {
        this.observer?.disconnect();
        CustomEventEmitter.remove("search-page-init", this.onSearchPageInit);
    }

    private setupObserver(): void {
        const target = this.querySelector(".observe") as HTMLElement;
        const callback = this.fetchSearchNaverBook;
        this.observer = new Observer(target, callback);
    }

    private onSearchPageInit(event: Event): void {
        const customEvent = event as CustomEvent<{
            keyword: string;
            sort: string;
        }>;
        const { keyword, sort } = customEvent.detail;

        this.keyword = keyword;
        this.sort = sort;
        this.length = 0;

        if (this.keyword) {
            // onSubmit으로 들어온 경우와 브라우저
            this.handleKeywordPresent();
            return;
        }

        // keyword 없을 때 기본 화면 노출, 브라우저
        this.handleKeywordAbsent();
    }

    private handleKeywordPresent(): void {
        this.showMessage("loading");
        this.books.innerHTML = "";
        this.fetchSearchNaverBook();
    }

    private handleKeywordAbsent(): void {
        this.pagingInfo.hidden = true;
        this.showMessage("message");
    }

    private async fetchSearchNaverBook(): Promise<void> {
        if (!this.keyword || !this.sort) return;

        const keyworkd = encodeURIComponent(this.keyword);
        const searchUrl = `/search-naver-book?keyword=${keyworkd}&display=${10}&start=${
            this.length + 1
        }&sort=${this.sort}`;

        console.log("fetch-search: ", searchUrl);

        try {
            const data = await CustomFetch.fetch<ISearchNaverBookResult>(
                searchUrl
            );
            this.render(data);
        } catch (error) {
            console.error(error);
            throw new Error(
                `Failed to get books with keyword ${this.keyword}.`
            );
        }
    }

    private render(data: ISearchNaverBookResult): void {
        const { total, display, items } = data;
        const prevLength = this.length;

        this.length += Number(display);
        this.updatePagingInfo({ total, display });
        this.pagingInfo.hidden = false;

        if (total === 0) {
            this.showMessage("notFound");
            return;
        }

        this.appendBookItems(items, prevLength);

        if (total !== this.length) {
            this.observer?.observe();
        }
    }

    private updatePagingInfo({
        total,
        display,
    }: {
        total: number;
        display: number;
    }) {
        const obj = {
            keyword: `${this.keyword}`,
            length: `${this.length.toLocaleString()}`,
            total: `${total.toLocaleString()}`,
            display: `${display}개씩`,
        };

        for (const [key, value] of Object.entries(obj)) {
            const element = this.pagingInfo.querySelector(
                `.__${key}`
            ) as HTMLElement;
            element.textContent = value;
        }
    }

    private appendBookItems(items: ISearchBook[], prevLength: number): void {
        const fragment = new DocumentFragment();

        const template = document.querySelector(
            "#tp-book-item"
        ) as HTMLTemplateElement;
        if (!template) return;

        const el = template.content.firstElementChild;
        if (!el) return;

        items.forEach((item, index) => {
            const cloned = el.cloneNode(true) as BookItem;
            cloned.bookData = item;
            cloned.dataset.index = (prevLength + index).toString();
            fragment.appendChild(cloned);
        });

        this.books.appendChild(fragment);
    }

    private showMessage(type: string) {
        const template = document.querySelector(
            `#tp-${type}`
        ) as HTMLTemplateElement;
        if (!template) return;

        const el = template.content.firstElementChild;
        if (!el) return;

        const cloned = el.cloneNode(true) as HTMLElement;
        this.books.innerHTML = "";
        this.books.appendChild(cloned);
    }
}

// this.observer = new IntersectionObserver( changes => {
//     changes.forEach( change => {
//         if (change.isIntersecting) {
//             this.observer.unobserve(change.target)
//             this.fetchSearchNaverBook()
//         }
//     })
// })
