import { CustomFetch } from "../../utils";

export default class KyoboInfo extends HTMLElement {
    private _isbn: string | null = null;
    private container: HTMLElement;

    constructor() {
        super();

        this._isbn = this.getIsbn() || null;
        this.container = this.querySelector("ul") as HTMLElement;
    }

    connectedCallback() {
        this.fetch();
    }

    disconnectedCallback() {
        //
    }

    getIsbn() {
        const cloeset = this.closest("[data-isbn]") as HTMLElement;
        if (!cloeset) return;
        return cloeset.dataset.isbn;
    }

    private async fetch() {
        const bookUrl = `/kyobo-book?isbn=${this._isbn}`;
        // const bookUrl = `/kyobo-book?isbn=S000001913217`;
        try {
            const infoArray = (await CustomFetch.fetch(
                bookUrl
            )) as Array<string>;
            this.render(infoArray);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`Error fetching books: ${error.message}`);
            } else {
                console.error("An unexpected error occurred");
            }
        }
    }

    private render(infos: Array<string>) {
        infos
            .map((text: string) => {
                const element = document.createElement("li") as HTMLElement;
                element.textContent = text;
                return element;
            })
            .forEach((element) => this.container.appendChild(element));
    }
}
