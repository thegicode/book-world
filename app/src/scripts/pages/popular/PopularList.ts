import { FetchListComponent } from "../../components";
import { CustomEventEmitter } from "../../utils";
import PopularItem from "./PopularItem";

export default class PopularList extends FetchListComponent<IPopularBookResponse, IPopularBook> {
    private params?: IPopularFetchParams;

    constructor() {
        super();
    }

    public loadPopularBooks(params: IPopularFetchParams) {
        this.params = params;
        const searchParams = new URLSearchParams(
            Object.entries(params)
                .filter(([, value]) => value !== undefined)
                .map(([key, value]) => [key, String(value)])
        );
        this.fetchData(`/popular-book?${searchParams}`);
    }

    protected getItems(data: IPopularBookResponse): IPopularBook[] {
        return data.data;
    }

    protected getTotal(data: IPopularBookResponse): number {
        return data.resultNum;
    }

    protected createItem(item: IPopularBook): HTMLElement | null {
        return new PopularItem(item);
    }

    protected onRenderComplete(data: IPopularBookResponse): void {
        if (this.params?.pageNo === "1") {
            CustomEventEmitter.dispatch("renderPageNav", {
                total: data.resultNum,
                pageSize: this.params.pageSize,
            });
        }
    }
}
