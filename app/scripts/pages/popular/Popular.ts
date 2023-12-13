// import { BookImage } from "../../components/index";
import { BookImage, LoadingComponent } from "../../components";
import { CustomEventEmitter, CustomFetch } from "../../utils";
import { cloneTemplate, getCurrentDates } from "../../utils/helpers";

export default class Popular extends HTMLElement {
    itemTemplate: HTMLTemplateElement | null;
    body: HTMLHtmlElement | null;
    list: HTMLElement | null;
    private loadingComponent: LoadingComponent | null;
    params: IPopularFetchParams | null;

    constructor() {
        super();

        this.itemTemplate = document.querySelector("#tp-popular-item");
        this.body = this.querySelector(".popular-body");
        this.list = this.querySelector(".popular-list");
        this.loadingComponent =
            this.querySelector<LoadingComponent>("loading-component");

        this.onRequestPopular = this.onRequestPopular.bind(this);
        this.onClickPageNav = this.onClickPageNav.bind(this);
        this.params = null;
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
        this.loadingComponent?.show();

        if (this.body && this.list) {
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

        this.loadingComponent?.hide();
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
    }

    createItem(item: IPopularBook) {
        const {
            // addition_symbol,
            bookImageURL,
            // bookname,
            bookDtlUrl,

            ...otherData

            // authors,  class_nm, isbn13, class_no, loan_count,  no,  publication_year,  publisher, ranking, vol,
        } = item;

        const isbn = item.isbn13;
        const bookname = item.bookname;

        if (this.itemTemplate === null) {
            throw new Error("Template is null");
        }
        const cloned = cloneTemplate(this.itemTemplate);

        cloned.dataset.isbn = isbn;

        const bookImage = new BookImage(bookImageURL, bookname);
        const linkEl = cloned.querySelector(".link") as HTMLLinkElement;
        linkEl.insertBefore(bookImage, linkEl.querySelector(".ranking"));

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
