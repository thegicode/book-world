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
            (_a = this.form) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new Event("submit"));
        };
        this.onSubmit = (event) => {
            var _a;
            event.preventDefault();
            if (!this.input)
                return;
            this.input.focus();
            const url = new URL(window.location.href);
            const keyword = this.input.value;
            const sort = (_a = this.form) === null || _a === void 0 ? void 0 : _a.sort.value;
            url.searchParams.set("keyword", keyword);
            url.searchParams.set("sort", sort);
            window.history.pushState({}, "", url.toString());
            bookList === null || bookList === void 0 ? void 0 : bookList.initializeSearchPage(keyword, sort);
            // CustomEventEmitter.dispatch(SEARCH_PAGE_INIT, { keyword, sort });
        };
        this.form = this.querySelector("form");
        this.input = this.querySelector("input[type='search']");
    }
    connectedCallback() {
        var _a, _b;
        (_a = this.form) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", this.onSubmit);
        (_b = this.form) === null || _b === void 0 ? void 0 : _b.sort.forEach((radio) => {
            radio.addEventListener("change", this.handleRadioChange);
        });
    }
    disconnectedCallback() {
        var _a, _b;
        (_a = this.form) === null || _a === void 0 ? void 0 : _a.removeEventListener("submit", this.onSubmit);
        (_b = this.form) === null || _b === void 0 ? void 0 : _b.sort.forEach((radio) => {
            radio.removeEventListener("change", this.handleRadioChange);
        });
    }
}
//# sourceMappingURL=InputSearch.js.map