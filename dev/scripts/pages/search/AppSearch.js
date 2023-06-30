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
        if (keyword) {
            CustomEventEmitter.dispatch("search-page-init", { keyword });
        }
        else {
            console.log("No keyword provided for search.");
        }
    }
}
//# sourceMappingURL=AppSearch.js.map