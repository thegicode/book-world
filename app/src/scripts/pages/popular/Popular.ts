// import { BookImage } from "../../components/index";
import { BookImage, LoadingComponent } from "../../components";
import { CustomEventEmitter, CustomFetch } from "../../utils";
import { cloneTemplate, getCurrentDates } from "../../utils/helpers";

export default class Popular extends HTMLElement {
    private itemTemplate: HTMLTemplateElement | null;
    private list: HTMLElement;
    private loadingComponent: LoadingComponent | null;
    private params: IPopularFetchParams | null;

    constructor() {
        super();

        this.itemTemplate = document.querySelector("#tp-popular-item");
        this.list = this.querySelector(".popular-list") as HTMLElement;
        this.loadingComponent =
            this.querySelector<LoadingComponent>("loading-component");

        this.onRequestPopular = this.onRequestPopular.bind(this);
        this.onClickPageNav = this.onClickPageNav.bind(this);
        this.params = null;
    }

    connectedCallback() {
        this.params = this.getParams();
        this.fetch(this.params);

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

    private getParams() {
        const { currentYear, currentMonth, currentDay } = getCurrentDates();
        return {
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
    }

    private async fetch(params: IPopularFetchParams): Promise<void> {
        this.loadingComponent?.show();

        this.list.innerHTML = "";

        const searchParams = new URLSearchParams(
            Object.entries(params)
                .filter(([, value]) => value !== undefined)
                .map(([key, value]) => [key, String(value)])
        );

        try {
            const data = await CustomFetch.fetch<IPopularBookResponse>(
                `/popular-book?${searchParams}`
            );
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

    private render({ data, resultNum }: IPopularBookResponse) {
        if (!this.list) return;

        console.log(resultNum);

        const fragment = new DocumentFragment();
        data.map((item) => this.createItem(item)).forEach(
            (element) => element && fragment.appendChild(element)
        );
        this.list.appendChild(fragment);
    }

    private createItem(item: IPopularBook) {
        const {
            // addition_symbol,
            bookImageURL,
            // bookname,
            bookDtlUrl,

            ...otherData

            // authors,  class_nm, isbn13, class_no, loan_count,  no,  publication_year,  publisher, ranking, vol,
        } = item;

        if (!this.itemTemplate) return;
        const cloned = cloneTemplate(this.itemTemplate);

        cloned.dataset.isbn = item.isbn13;

        const linkEl = cloned.querySelector(".link") as HTMLLinkElement;
        linkEl.insertBefore(
            new BookImage(bookImageURL, item.bookname),
            linkEl.querySelector(".ranking")
        );

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
        if (anchorEl) anchorEl.href = `/book?isbn=${item.isbn13}`;

        return cloned;
    }

    private onRequestPopular(
        event: ICustomEvent<{ params: IPopularFetchParams }>
    ) {
        this.params = event.detail.params;
        this.fetch(this.params);
    }

    private onClickPageNav(event: ICustomEvent<{ pageIndex: number }>) {
        if (!this.params) return;
        this.params.pageNo = event.detail.pageIndex.toString();
        this.fetch(this.params);
    }
}
