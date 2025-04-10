import bookModel from "../../model";

export default class LibraryItem extends HTMLElement {
    protected checkbox: HTMLInputElement | null = null;
    private libCode = "";
    data!: ILibraryData;

    constructor() {
        super();

        this.checkbox =
            this.querySelector<HTMLInputElement>("[name=myLibrary]");

        this.onChange = this.onChange.bind(this);

        this.subscribeUpdate = this.subscribeUpdate.bind(this);
    }

    connectedCallback() {
        this.render();

        this.checkbox?.addEventListener("click", this.onChange);

        bookModel.subscribeLibraryUpdate(this.subscribeUpdate);
    }

    disconnectedCallback() {
        this.checkbox?.removeEventListener("click", this.onChange);
        bookModel.unsubscribeLibraryUpdate(this.subscribeUpdate);
    }

    protected render() {
        const { data } = this;
        if (data === null) return;

        this.libCode = data.libCode;

        Object.entries(data).forEach(([key, value]) => {
            const element = this.querySelector(`.${key}`);
            if (element) {
                element.innerHTML = value;
            }
        });

        const hoempageLink = this.querySelector<HTMLLinkElement>(".homepage");
        if (hoempageLink) hoempageLink.href = data.homepage;

        if (this.checkbox) {
            this.checkbox.checked = bookModel.hasLibrary(this.libCode);
        }
    }

    protected onChange() {
        if (this.checkbox?.checked) {
            bookModel.addLibraries(this.libCode, this.data);
        } else {
            bookModel.removeLibraries(this.libCode);
        }
    }

    private subscribeUpdate({ type, payload }: TLibraryUpdateProps) {
        if (type == "delete" && payload.code == this.libCode) {
            if (this.checkbox) {
                this.checkbox.checked = false;
            }
        }
    }
}
