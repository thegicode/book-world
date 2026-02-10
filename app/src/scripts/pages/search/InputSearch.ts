import store from "../../model/Store";

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

        store.searchBooks(keyword, sort);
    };
}
