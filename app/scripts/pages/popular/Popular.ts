// import { BookImage } from "../../components/index";
import { CustomEventEmitter, CustomFetch } from "../../utils";
import { getCurrentDates } from "../../utils/helpers";

export default class Popular extends HTMLElement {
    itemTemplate: HTMLTemplateElement | null;
    body: HTMLHtmlElement | null;
    list: HTMLElement | null;
    loading: HTMLElement | null;
    params: IPopularFetchParams | null;

    constructor() {
        super();

        this.itemTemplate = document.querySelector("#tp-popular-item");
        this.body = this.querySelector(".popular-body");
        this.list = this.querySelector(".popular-list");
        this.loading = document.querySelector(".popular-loading");
        this.onRequestPopular = this.onRequestPopular.bind(this);
        this.onClickPageNav = this.onClickPageNav.bind(this);
        this.params = null;

        // console.log(BookImage);
    }

    connectedCallback() {
        const { currentYear, currentMonth, currentDay } = getCurrentDates();
        const params = {
            startDt: "2023-01-01",
            endDt: `${currentYear}-${currentMonth}-${currentDay}`,
            gender: "",
            age: "",
            region: "",
            addCode: "",
            kdc: "",
            pageNo: "1",
            pageSize: "100",
        };
        this.params = params;

        this.fetch(params);

        CustomEventEmitter.add(
            "requestPopular",
            this.onRequestPopular as EventListener
        );

        CustomEventEmitter.add(
            "clickPageNav",
            this.onClickPageNav as EventListener
        );
    }

    disconnectedCallback() {
        CustomEventEmitter.remove(
            "requestPopular",
            this.onRequestPopular as EventListener
        );
        CustomEventEmitter.remove(
            "clickPageNav",
            this.onClickPageNav as EventListener
        );
    }

    async fetch(params: IPopularFetchParams): Promise<void> {
        if (this.body && this.list) {
            this.body.dataset.loading = "true";
            this.list.innerHTML = "";
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

            if (params.pageNo === "1") {
                CustomEventEmitter.dispatch("renderPageNav", {
                    pageSize: params.pageSize,
                });
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Fail to get library search by book.`);
        }
    }

    render({ data, resultNum }: IPopularBookResponse) {
        if (!this.list) return;

        console.log(resultNum);

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
            bookImageURL,
            bookname,
            bookDtlUrl,

            ...otherData

            // authors,  class_nm, isbn13, class_no, loan_count,  no,  publication_year,  publisher, ranking, vol,
        } = item;

        const isbn = item.isbn13;

        const cloned = this.itemTemplate?.content.firstElementChild?.cloneNode(
            true
        ) as HTMLElement;
        if (!cloned) return null;

        cloned.dataset.isbn = isbn;

        const imageNode = cloned.querySelector("img");
        if (imageNode) {
            imageNode.src = bookImageURL;
            imageNode.alt = bookname;
        }

        const bookDtlUrlNode = cloned.querySelector(
            ".bookDtlUrl"
        ) as HTMLAnchorElement;
        if (bookDtlUrlNode) {
            bookDtlUrlNode.href = bookDtlUrl;
        }

        Object.entries(otherData).forEach(([key, value]) => {
            const element = cloned.querySelector(`.${key}`) as HTMLElement;
            if (element) element.textContent = value as string;
        });

        const anchorEl = cloned.querySelector("a") as HTMLAnchorElement;
        if (anchorEl) anchorEl.href = `/book?isbn=${isbn}`;

        return cloned;
    }

    onRequestPopular(event: ICustomEvent<{ params: IPopularFetchParams }>) {
        const { params } = event.detail;
        this.params = params;
        this.fetch(params);
    }

    onClickPageNav(event: ICustomEvent<{ pageIndex: number }>) {
        const { pageIndex } = event.detail;

        if (this.params) {
            this.params.pageNo = pageIndex.toString();
            this.fetch(this.params);
        }
    }
}
