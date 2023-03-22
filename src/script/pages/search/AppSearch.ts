import { CustomEventEmitter } from "../../utils/index.js";

export default class AppSearch extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.renderBookList();
        window.addEventListener("popstate", this.onPopState.bind(this));
    }

    disconnectedCallback() {
        window.removeEventListener("popstate", this.onPopState);
    }

    private onPopState() {
        this.renderBookList();
    }

    private renderBookList() {
        const params = new URLSearchParams(location.search);
        const keyword = params.get("keyword");
        CustomEventEmitter.dispatch("search-page-init", { keyword });
    }
}
