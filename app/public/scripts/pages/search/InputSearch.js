// import { CustomEventEmitter } from "../../utils/index";
// import { SEARCH_PAGE_INIT } from "./constant";
import { bookList } from "./selectors";
export default class InputSearch extends HTMLElement {
    constructor() {
        super();
        this.handleRadioChange = () => {
            this.form.dispatchEvent(new Event("submit"));
        };
        this.onSubmit = (event) => {
            event.preventDefault();
            if (!this.input)
                return;
            this.input.focus();
            const url = new URL(window.location.href);
            const keyword = this.input.value;
            const sort = this.form.sort.value;
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
        this.form.addEventListener("submit", this.onSubmit);
        this.form.sort.forEach((radio) => {
            radio.addEventListener("change", this.handleRadioChange);
        });
    }
    disconnectedCallback() {
        this.form.removeEventListener("submit", this.onSubmit);
        this.form.sort.forEach((radio) => {
            radio.removeEventListener("change", this.handleRadioChange);
        });
    }
}
//# sourceMappingURL=InputSearch.js.map