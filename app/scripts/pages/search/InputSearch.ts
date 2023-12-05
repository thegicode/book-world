// import { CustomEventEmitter } from "../../utils/index";
// import { SEARCH_PAGE_INIT } from "./constant";
import { bookList } from "./selectors";

export default class InputSearch extends HTMLElement {
    private form: HTMLFormElement | null = null;
    private input: HTMLInputElement | null = null;

    constructor() {
        super();

        this.form = this.querySelector("form") as HTMLFormElement;
        this.input = this.querySelector(
            "input[type='search']"
        ) as HTMLInputElement;
    }

    connectedCallback() {
        this.form?.addEventListener("submit", this.onSubmit);
        this.form?.sort.forEach((radio: HTMLInputElement) => {
            radio.addEventListener("change", this.handleRadioChange);
        });
    }

    disconnectedCallback() {
        this.form?.removeEventListener("submit", this.onSubmit);
        this.form?.sort.forEach((radio: HTMLInputElement) => {
            radio.removeEventListener("change", this.handleRadioChange);
        });
    }

    private handleRadioChange = () => {
        const submitEvent = new Event("submit");
        this.form?.dispatchEvent(submitEvent);
    };

    private onSubmit = (event: Event) => {
        event.preventDefault();

        if (!this.input) return;

        const keyword = this.input.value;
        const sort = this.form?.sort.value;

        this.input.focus();

        if (keyword && sort) {
            const url = new URL(window.location.href);

            url.searchParams.set("keyword", keyword);
            url.searchParams.set("sort", sort);

            window.history.pushState({}, "", url.toString());

            bookList?.initializeSearchPage(keyword, sort);
            // CustomEventEmitter.dispatch(SEARCH_PAGE_INIT, { keyword, sort });
        }
    };
}
