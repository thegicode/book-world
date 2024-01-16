// import { CustomEventEmitter } from "../../utils/index";
// import { SEARCH_PAGE_INIT } from "./constant";
import { bookList } from "./selectors";

export default class InputSearch extends HTMLElement {
    private form: HTMLFormElement;
    private input: HTMLInputElement;

    constructor() {
        super();

        this.form = this.querySelector("form") as HTMLFormElement;
        this.input = this.querySelector(
            "input[type='search']"
        ) as HTMLInputElement;
    }

    connectedCallback() {
        this.form.addEventListener("submit", this.onSubmit);
        this.form.sort.forEach((radio: HTMLInputElement) => {
            radio.addEventListener("change", this.handleRadioChange);
        });
    }

    disconnectedCallback() {
        this.form.removeEventListener("submit", this.onSubmit);
        this.form.sort.forEach((radio: HTMLInputElement) => {
            radio.removeEventListener("change", this.handleRadioChange);
        });
    }

    private handleRadioChange = () => {
        this.form.dispatchEvent(new Event("submit"));
    };

    private onSubmit = (event: Event) => {
        event.preventDefault();

        if (!this.input) return;
        this.input.focus();

        const url = new URL(window.location.href);
        const keyword = this.input.value;
        const sort = this.form.sort.value;

        url.searchParams.set("keyword", keyword);
        url.searchParams.set("sort", sort);

        window.history.pushState({}, "", url.toString());

        bookList?.initializeSearchPage(keyword, sort);
        // CustomEventEmitter.dispatch(SEARCH_PAGE_INIT, { keyword, sort });
    };
}
