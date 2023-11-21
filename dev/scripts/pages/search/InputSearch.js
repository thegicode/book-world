// import { CustomEventEmitter } from "../../utils/index";
// import { SEARCH_PAGE_INIT } from "./constant";
import { bookList } from "./selectors";
export default class InputSearch extends HTMLElement {
    constructor() {
        super();
        this.form = null;
        this.input = null;
        this.handleRadioChange = () => {
            var _a;
            const submitEvent = new Event("submit");
            (_a = this.form) === null || _a === void 0 ? void 0 : _a.dispatchEvent(submitEvent);
        };
        this.onSubmit = (event) => {
            var _a;
            event.preventDefault();
            if (!this.input)
                return;
            const keyword = this.input.value;
            const sort = (_a = this.form) === null || _a === void 0 ? void 0 : _a.sort.value;
            this.input.focus();
            if (keyword && sort) {
                const url = new URL(window.location.href);
                url.searchParams.set("keyword", keyword);
                url.searchParams.set("sort", sort);
                window.history.pushState({}, "", url.toString());
                bookList === null || bookList === void 0 ? void 0 : bookList.initializeSearchPage(keyword, sort);
                // CustomEventEmitter.dispatch(SEARCH_PAGE_INIT, { keyword, sort });
            }
        };
        this.initialize();
    }
    connectedCallback() {
        var _a, _b;
        (_a = this.form) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", this.onSubmit);
        const radios = (_b = this.form) === null || _b === void 0 ? void 0 : _b.sort;
        radios.forEach((radio) => {
            radio.addEventListener("change", this.handleRadioChange);
        });
    }
    disconnectedCallback() {
        var _a;
        (_a = this.form) === null || _a === void 0 ? void 0 : _a.removeEventListener("submit", this.onSubmit);
    }
    initialize() {
        this.form = this.querySelector("form");
        this.input = this.querySelector("input[type='search']");
    }
}
//# sourceMappingURL=InputSearch.js.map