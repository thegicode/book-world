import { CustomEventEmitter } from "../../utils/index";
export default class InputSearch extends HTMLElement {
    constructor() {
        super();
        this.form = null;
        this.input = null;
        this.onSubmit = (event) => {
            event.preventDefault();
            if (!this.input)
                return;
            const keyword = this.input.value;
            this.input.value = "";
            const url = new URL(window.location.href);
            url.searchParams.set("keyword", keyword);
            window.history.pushState({}, "", url.toString());
            CustomEventEmitter.dispatch("search-page-init", { keyword });
            this.input.focus();
        };
        this.initialize();
    }
    connectedCallback() {
        var _a;
        (_a = this.form) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", this.onSubmit);
    }
    disconnectedCallback() {
        var _a;
        (_a = this.form) === null || _a === void 0 ? void 0 : _a.removeEventListener("submit", this.onSubmit);
    }
    initialize() {
        this.form = this.querySelector("form");
        this.input = this.querySelector("input");
    }
}
//# sourceMappingURL=InputSearch.js.map