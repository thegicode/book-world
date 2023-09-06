import { CustomEventEmitter } from "../../utils/index";

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
        const sort = params.get("sort");
        const searchElement = document.querySelector(
            "input-search input[type='search']"
        ) as HTMLInputElement;

        if (keyword && sort) {
            CustomEventEmitter.dispatch("search-page-init", { keyword, sort });
            searchElement.value = keyword;
        }
    }
}
