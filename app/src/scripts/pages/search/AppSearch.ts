import store from "@/model/Store";
import { searchInputElement } from "./selectors";

export default class AppSearch extends HTMLElement {
    private boundPopStateHandler: ((ev: PopStateEvent) => void) | null = null;

    constructor() {
        super();
    }

    connectedCallback() {
        this.renderSearchResult();

        this.boundPopStateHandler = this.onPopState.bind(this);
        window.addEventListener("popstate", this.boundPopStateHandler);
    }

    disconnectedCallback() {
        if (this.boundPopStateHandler) {
            window.removeEventListener("popstate", this.boundPopStateHandler);
        }
    }

    private onPopState() {
        this.renderSearchResult();
    }

    private renderSearchResult() {
        const params = new URLSearchParams(location.search);
        const keyword = params.get("keyword");
        const sort = params.get("sort") || "sim";

        if (keyword) {
            store.searchBooks(keyword, sort);
            if (searchInputElement) {
                searchInputElement.value = keyword;
            }
        }
    }
}
