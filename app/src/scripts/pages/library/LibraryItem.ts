import template from "../../../markup/templates/library-item.html";
import bookModel from "../../model";
import { BaseItemComponent } from "../../components";

export default class LibraryItem extends BaseItemComponent {
    protected checkbox: HTMLInputElement | null = null;
    private libCode = "";
    data!: ILibraryData;

    constructor(data: ILibraryData) {
        super(template);
        this.data = data;
        this.onChange = this.onChange.bind(this);
        this.subscribeUpdate = this.subscribeUpdate.bind(this);
    }

    protected onMount(): void {
        this.checkbox =
            this.querySelector<HTMLInputElement>("[name=myLibrary]");
            
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
