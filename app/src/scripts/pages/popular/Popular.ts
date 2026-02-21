import { CustomEventEmitter } from "@/utils";
import { getCurrentDates } from "@/utils/helpers";
import PopularList from "./PopularList";

export default class Popular extends HTMLElement {
    private popularList!: PopularList;
    private params: IPopularFetchParams | null;

    constructor() {
        super();
        this.onRequestPopular = this.onRequestPopular.bind(this);
        this.onClickPageNav = this.onClickPageNav.bind(this);
        this.params = null;
    }

    connectedCallback() {
        this.popularList = this.querySelector('popular-list') as PopularList;
        this.params = this.getParams();
        this.popularList.loadPopularBooks(this.params);

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

    private onRequestPopular(
        event: ICustomEvent<{ params: IPopularFetchParams }>
    ) {
        this.params = event.detail.params;
        this.popularList.loadPopularBooks(this.params);
    }

    private onClickPageNav(event: ICustomEvent<{ pageIndex: number }>) {
        if (!this.params) return;
        this.params.pageNo = event.detail.pageIndex.toString();
        this.popularList.loadPopularBooks(this.params);
    }
}
