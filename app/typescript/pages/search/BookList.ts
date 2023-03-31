import { ISearchBook, ISearchNaverBookResult } from "../../modules/types";
import BookItem from "./BookItem";
import { Observer, CustomFetch, CustomEventEmitter } from "../../utils/index";

export default class BookList extends HTMLElement {
    pagingInfo!: HTMLElement;
    books!: HTMLElement;
    observer?: Observer;
    keyword?: string;
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
        const customEvent = event as CustomEvent<{ keyword: string }>;
        this.keyword = customEvent.detail.keyword;
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
        if (!this.keyword) return;

        const url = `/search-naver-book?keyword=${encodeURIComponent(
            this.keyword
        )}&display=${10}&start=${this.length + 1}`;
        try {
            const data = await CustomFetch.fetch<ISearchNaverBookResult>(url);
            this.render(data);
        } catch (error) {
            console.error(error);
            throw new Error("Fail to get naver book.");
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

        items.forEach((item, index) => {
            const template = (
                document.querySelector(
                    "[data-template=book-item]"
                ) as HTMLTemplateElement
            ).content.firstElementChild;
            if (!template) return;
            const el = template.cloneNode(true) as BookItem;
            el.bookData = item;
            el.dataset.index = (prevLength + index).toString();
            fragment.appendChild(el);
        });

        this.books.appendChild(fragment);
    }

    private showMessage(type: string) {
        const template = (
            document.querySelector(`#tp-${type}`) as HTMLTemplateElement
        ).content.firstElementChild;
        if (!template) return;
        const el = template.cloneNode(true);
        this.books.innerHTML = "";
        this.books.appendChild(el);
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
