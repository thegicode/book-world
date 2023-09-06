import { CustomEventEmitter } from "../../utils/index";

export default class InputSearch extends HTMLElement {
    private form: HTMLFormElement | null = null;
    private input: HTMLInputElement | null = null;

    constructor() {
        super();
        this.initialize();
    }

    connectedCallback() {
        this.form?.addEventListener("submit", this.onSubmit);

        const radios = this.form?.sort;
        radios.forEach((radio: HTMLInputElement) => {
            radio.addEventListener("change", this.handleRadioChange);
        });
    }

    disconnectedCallback() {
        this.form?.removeEventListener("submit", this.onSubmit);
    }

    private initialize() {
        this.form = this.querySelector("form") as HTMLFormElement;
        this.input = this.querySelector(
            "input[type='search']"
        ) as HTMLInputElement;
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

        const url = new URL(window.location.href);
        url.searchParams.set("keyword", keyword);
        url.searchParams.set("sort", sort);

        window.history.pushState({}, "", url.toString());

        CustomEventEmitter.dispatch("search-page-init", { keyword, sort });

        this.input.focus();
    };
}
