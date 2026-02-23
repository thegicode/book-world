import template from "../../../markup/templates/library-search-item.html";
import bookModel, { BookModelEvent } from "@/model";
import { BaseItemComponent } from "@/components";

export default class LibrarySearchItem extends BaseItemComponent {
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

        bookModel.subscribe(BookModelEvent.LibraryUpdate, this.subscribeUpdate);
    }

    disconnectedCallback() {
        this.checkbox?.removeEventListener("click", this.onChange);
        bookModel.unsubscribe(
            BookModelEvent.LibraryUpdate,
            this.subscribeUpdate
        );
    }

    protected render() {
        const { data } = this;
        if (data === null) return;

        this.libCode = data.libCode;

        const libNameElement = this.querySelector('.libName');
        if (libNameElement) {
            const link = document.createElement('a');
            link.href = `/library?libCode=${this.libCode}`;
            link.textContent = data.libName;
            libNameElement.innerHTML = ''; // Clear existing content
            libNameElement.appendChild(link);
        }
        
        // Populate other fields as before
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'libName' || key === 'homepage') return; // Skip libName and homepage
            const element = this.querySelector(`.${key}`);
            if (element && value) {
                element.innerHTML = value;
            }
        });

        const hoempageLink = this.querySelector<HTMLLinkElement>(".homepage");
        if (hoempageLink && data.homepage) {
            hoempageLink.href = data.homepage;
            hoempageLink.textContent = data.homepage; // Set visible text to URL
            
            const srText = document.createElement("span");
            srText.className = "visually-hidden";
            srText.textContent = "(새 창)";
            hoempageLink.appendChild(srText);
        }

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

    private subscribeUpdate(update?: TLibraryUpdateProps) {
        if (!update) return;
        const { type, payload } = update;

        if (type == "delete" && payload.code == this.libCode) {
            if (this.checkbox) {
                this.checkbox.checked = false;
            }
        }
    }
}
