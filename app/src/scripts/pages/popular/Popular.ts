import { getCurrentDates } from "@/utils/helpers";
import PopularList from "./PopularList";
import PopularSearch from "./PopularSearch";

export default class Popular extends HTMLElement {
    private popularList!: PopularList;
    private popularSearch!: PopularSearch;
    private params: IPopularFetchParams | null;

    constructor() {
        super();
        this.params = null;
    }

    connectedCallback() {
        this.popularList = this.querySelector('popular-list') as PopularList;
        this.popularSearch = this.querySelector('popular-search') as PopularSearch;
        this.params = this.getParams();
        this.popularList.loadPopularBooks(this.params);

        this.addEventListener("request-popular", this.onRequestPopular as EventListener);
        this.addEventListener("click-page-nav", this.onClickPageNav as EventListener);
        this.addEventListener("render-page-nav", this.onRenderPageNav as EventListener);
    }

    disconnectedCallback() {
        this.removeEventListener("request-popular", this.onRequestPopular as EventListener);
        this.removeEventListener("click-page-nav", this.onClickPageNav as EventListener);
        this.removeEventListener("render-page-nav", this.onRenderPageNav as EventListener);
    }

    private getParams(): IPopularFetchParams {
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

    private onRequestPopular = (event: CustomEvent<{ params: IPopularFetchParams }>) => {
        this.params = event.detail.params;
        this.popularList.loadPopularBooks(this.params);
    };

    private onClickPageNav = (event: CustomEvent<{ pageIndex: number }>) => {
        if (!this.params) return;
        this.params.pageNo = event.detail.pageIndex.toString();
        this.popularList.loadPopularBooks(this.params);
    };

    private onRenderPageNav = (event: CustomEvent<{ pageSize: number }>) => {
        this.popularSearch.renderPageNav(Number(event.detail.pageSize));
    };
}
