import bookStore from "../../modules/BookStore";

export default class LibraryItem extends HTMLElement {
    protected checkbox: HTMLInputElement | null = null;
    private libCode = "";
    private libName = "";
    data!: ILibrary;

    constructor() {
        super();

        this.checkbox =
            this.querySelector<HTMLInputElement>("[name=myLibrary]");

        this.onChange = this.onChange.bind(this);
    }

    connectedCallback() {
        this.render();

        this.checkbox?.addEventListener("click", this.onChange);
    }

    disconnectedCallback() {
        this.checkbox?.removeEventListener("click", this.onChange);
    }

    protected render() {
        const { data } = this;
        if (data === null) return;

        const { libCode, libName } = data;
        this.libCode = libCode;
        this.libName = libName;

        Object.entries(data).forEach(([key, value]) => {
            const element = this.querySelector(`.${key}`);
            if (element) {
                element.innerHTML = value;
            }
        });

        const hoempageLink = this.querySelector<HTMLLinkElement>(".homepage");
        if (hoempageLink) hoempageLink.href = data.homepage;

        if (this.checkbox) {
            this.checkbox.checked = bookStore.hasLibrary(libCode);
        }
    }

    protected onChange() {
        if (this.checkbox?.checked) {
            bookStore.addLibrary(this.libCode, this.libName);
        } else {
            bookStore.removeLibrary(this.libCode);
        }
    }
}
