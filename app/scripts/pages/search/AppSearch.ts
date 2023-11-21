// import { CustomEventEmitter } from "../../utils/index";
// import { SEARCH_PAGE_INIT } from "./constant";
import { bookList, searchInputElement } from "./selectors";

export default class AppSearch extends HTMLElement {
    private boundPopStateHandler: ((ev: PopStateEvent) => void) | null = null;

    constructor() {
        super();
    }

    connectedCallback() {
        this.renderBookList();
        this.boundPopStateHandler = this.onPopState.bind(this);
        window.addEventListener("popstate", this.boundPopStateHandler);
    }

    disconnectedCallback() {
        if (this.boundPopStateHandler) {
            window.removeEventListener("popstate", this.boundPopStateHandler);
        }
    }

    private onPopState() {
        this.renderBookList();
    }

    private renderBookList() {
        const params = new URLSearchParams(location.search);
        const keyword = params.get("keyword");
        const sort = params.get("sort") || "sim";

        if (keyword && sort) {
            bookList?.initializeSearchPage(keyword, sort);
            // CustomEventEmitter.dispatch(SEARCH_PAGE_INIT, { keyword, sort });
            searchInputElement.value = keyword;
        }
    }
}
