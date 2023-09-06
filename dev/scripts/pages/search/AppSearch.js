import { CustomEventEmitter } from "../../utils/index";
export default class AppSearch extends HTMLElement {
    constructor() {
        super();
        this.boundPopStateHandler = null;
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
    onPopState() {
        this.renderBookList();
    }
    renderBookList() {
        const params = new URLSearchParams(location.search);
        const keyword = params.get("keyword");
        const sort = params.get("sort");
        const searchElement = document.querySelector("input-search input[type='search']");
        if (keyword && sort) {
            CustomEventEmitter.dispatch("search-page-init", { keyword, sort });
            searchElement.value = keyword;
        }
    }
}
//# sourceMappingURL=AppSearch.js.map