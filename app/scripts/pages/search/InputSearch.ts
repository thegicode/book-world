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
    }

    disconnectedCallback() {
        this.form?.removeEventListener("submit", this.onSubmit);
    }

    private initialize() {
        this.form = this.querySelector("form") as HTMLFormElement;
        this.input = this.querySelector("input") as HTMLInputElement;
    }

    private onSubmit = (event: Event) => {
        event.preventDefault();

        if (!this.input) return;

        const keyword = this.input.value;

        this.input.value = "";

        const url = new URL(window.location.href);
        url.searchParams.set("keyword", keyword);
        window.history.pushState({}, "", url.toString());

        CustomEventEmitter.dispatch("search-page-init", { keyword });

        this.input.focus();
    };
}
