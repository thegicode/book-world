import { ILibrary } from "../../modules/types";
import { addLibrary, removeLibrary, hasLibrary } from "../../modules/model";

export default class LibraryItem extends HTMLElement {
    private checkbox: HTMLInputElement | null = null;
    private libCode = "";
    private libName = "";

    constructor() {
        super();
        this.checkbox =
            this.querySelector<HTMLInputElement>("[name=myLibrary]");
    }

    connectedCallback() {
        this.render();
        this.checkbox?.addEventListener("click", this.onChange.bind(this));
    }

    disconnectedCallback() {
        this.checkbox?.removeEventListener("click", this.onChange);
    }

    private render(): void {
        const data = JSON.parse(this.dataset.object || "") as ILibrary;
        const { libCode, libName } = data;

        Object.entries(data).forEach(([key, value]) => {
            const element = this.querySelector(`.${key}`);
            if (element) {
                element.innerHTML = value;
            }
        });

        const hoempageLink = this.querySelector<HTMLLinkElement>(".homepage");
        if (hoempageLink) hoempageLink.href = data.homepage;

        this.libCode = libCode;
        this.libName = libName;

        if (this.checkbox) this.checkbox.checked = hasLibrary(this.libCode);
    }

    private onChange(event: MouseEvent): void {
        const target = event.target as HTMLInputElement;
        if (target.checked) {
            addLibrary(this.libCode, this.libName);
        } else {
            removeLibrary(this.libCode);
        }
    }
}
