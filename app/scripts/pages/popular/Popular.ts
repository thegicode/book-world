import { CustomEventEmitter, CustomFetch } from "../../utils";
import { getCurrentDates } from "../../utils/utils";

export default class Popular extends HTMLElement {
    itemTemplate: HTMLTemplateElement | null;
    body: HTMLHtmlElement | null;
    list: HTMLElement | null;
    loading: HTMLElement | null;

    constructor() {
        super();

        this.itemTemplate = document.querySelector("#tp-popular-item");
        this.body = this.querySelector(".popular-body");
        this.list = this.querySelector(".popular-list");
        this.loading = document.querySelector(".popular-loading");
        this.onRequestPopular = this.onRequestPopular.bind(this);
    }

    connectedCallback() {
        const { currentYear, currentMonth, currentDay } = getCurrentDates();
        const params = {
            startDt: "2022-01-01",
            endDt: `${currentYear}-${currentMonth}-${currentDay}`,
            gender: "A",
            age: "20",
            region: "11;31",
            addCode: "0",
            kdc: "6",
            pageNo: "1",
            pageSize: "10",
        };
        this.fetch(params);

        CustomEventEmitter.add(
            "requestPopular",
            this.onRequestPopular as EventListener
        );
    }

    disconnectedCallback() {
        CustomEventEmitter.remove(
            "requestPopular",
            this.onRequestPopular as EventListener
        );
    }

    onRequestPopular(event: ICustomEvent<{ params: IPopularFetchParams }>) {
        const { params } = event.detail;
        this.fetch(params);
    }

    async fetch(params: IPopularFetchParams): Promise<void> {
        if (this.body) {
            this.body.dataset.loading = "true";
        }

        const searchParams = new URLSearchParams(
            Object.entries(params)
                .filter(([, value]) => value !== undefined)
                .map(([key, value]) => [key, String(value)])
        );

        const url = `/popular-book?${searchParams}`;

        try {
            const data = await CustomFetch.fetch<IPopularBookResponse>(url);
            this.render(data);
        } catch (error) {
            console.error(error);
            throw new Error(`Fail to get library search by book.`);
        }
    }

    render({ data, resultNum }: IPopularBookResponse) {
        console.log("resultNum", resultNum);
        if (!this.list) return;
        this.list.innerHTML = "";

        const fragment = new DocumentFragment();

        data.map((item) => {
            const cloned = this.createItem(item);
            cloned && fragment.appendChild(cloned);
        });

        this.list.appendChild(fragment);

        if (this.body) {
            this.body.dataset.loading = "false";
        }
    }

    createItem(item: IPopularBook) {
        const {
            // addition_symbol,
            authors,
            bookDtlUrl,
            bookImageURL,
            bookname,
            class_nm,
            // class_no,
            isbn13,
            loan_count,
            no,
            publication_year,
            publisher,
            ranking,
            // vol,
        } = item;

        const cloned = this.itemTemplate?.content.firstElementChild?.cloneNode(
            true
        ) as HTMLElement;
        if (!cloned) return null;

        const bookNameEl = cloned.querySelector(".bookname") as HTMLElement;
        const rankingEl = cloned.querySelector(".ranking") as HTMLElement;
        const authorsEl = cloned.querySelector(".authors") as HTMLElement;
        const publicationYeaEl = cloned.querySelector(
            ".publication_year"
        ) as HTMLElement;
        const publisherEl = cloned.querySelector(".publisher") as HTMLElement;
        const classEl = cloned.querySelector(".class_nm") as HTMLElement;
        const isbnEl = cloned.querySelector(".isbn13") as HTMLElement;
        const loanCountEl = cloned.querySelector(".loan_count") as HTMLElement;
        const bookDtlUrlEl = cloned.querySelector(
            ".bookDtlUrl"
        ) as HTMLLinkElement;
        const imageEl = cloned.querySelector(".bookImage") as HTMLImageElement;

        cloned.dataset.index = no.toString();
        bookNameEl.textContent = bookname;
        rankingEl.textContent = ranking;
        authorsEl.textContent = authors;
        publicationYeaEl.textContent = publication_year;
        publisherEl.textContent = publisher;
        classEl.textContent = class_nm;
        isbnEl.textContent = isbn13;
        loanCountEl.textContent = loan_count;
        bookDtlUrlEl.href = bookDtlUrl;
        imageEl.src = bookImageURL;

        return cloned;
    }
}
