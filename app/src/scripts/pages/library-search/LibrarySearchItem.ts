import bookModel, { BookModelEvent } from "@/model";
import { BaseItemComponent } from "@/components";

export default class LibrarySearchItem extends BaseItemComponent {
    protected checkbox: HTMLInputElement | null = null;
    private libCode = "";
    data!: ILibraryData;

    static get observedAttributes() {
        return ["selected"];
    }

    constructor(data: ILibraryData) {
        super("#tp-library-search-item", true);
        this.data = data;
        this.onChange = this.onChange.bind(this);
        this.subscribeUpdate = this.subscribeUpdate.bind(this);
    }

    get selected() {
        return this.hasAttribute("selected");
    }

    set selected(value: boolean) {
        if (value) {
            this.setAttribute("selected", "");
        } else {
            this.removeAttribute("selected");
        }
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === "selected" && oldValue !== newValue) {
            if (this.checkbox) {
                this.checkbox.checked = newValue !== null;
            }
        }
    }

    protected onMount(): void {
        this.checkbox =
            this.querySelector<HTMLInputElement>("[name=myLibrary]");
        this.setAttribute("role", "listitem");
            
        this.libCode = this.data.libCode;
        
        // 초기 상태 동기화 (Model -> Attribute)
        if (bookModel.hasLibrary(this.libCode)) {
            this.selected = true;
        }

        this.render();

        this.checkbox?.addEventListener("change", this.onChange);

        bookModel.subscribe(BookModelEvent.LibraryUpdate, this.subscribeUpdate);
    }

    disconnectedCallback() {
        this.checkbox?.removeEventListener("change", this.onChange);
        bookModel.unsubscribe(
            BookModelEvent.LibraryUpdate,
            this.subscribeUpdate
        );
    }

    protected render() {
        const { data } = this;
        if (data === null) return;

        const libNameElement = this.querySelector('.libName');
        if (libNameElement) {
            const link = document.createElement('a');
            link.href = `/library?libCode=${encodeURIComponent(this.libCode)}`;
            link.textContent = data.libName;
            libNameElement.innerHTML = ''; // Clear existing content
            libNameElement.appendChild(link);
        }
        
        // Populate other fields as before
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'libName' || key === 'homepage') return; // Skip libName and homepage
            const element = this.querySelector(`.${key}`);
            if (element && value !== null && value !== undefined) {
                element.textContent = String(value);
            }
        });

        const homepageLink = this.querySelector<HTMLAnchorElement>(".homepage");
        if (homepageLink && data.homepage) {
            homepageLink.href = data.homepage;
            homepageLink.textContent = data.homepage; // Set visible text to URL
            
            const srText = document.createElement("span");
            srText.className = "visually-hidden";
            srText.textContent = "(새 창)";
            homepageLink.appendChild(srText);
        }

        if (this.checkbox) {
            this.checkbox.checked = this.selected; // Use reflected property
            this.checkbox.id = `my-library-${this.libCode}`;
            this.checkbox.setAttribute("aria-label", `${data.libName} 관심 도서관`);
            const checkboxLabel = this.querySelector<HTMLLabelElement>(".my-library-label");
            if (checkboxLabel) {
                checkboxLabel.htmlFor = this.checkbox.id;
            }
        }
    }

    protected onChange() {
        const isChecked = this.checkbox?.checked ?? false;
        this.selected = isChecked; // Sync UI -> Attribute

        if (isChecked) {
            bookModel.addLibraries(this.libCode, this.data);
        } else {
            bookModel.removeLibraries(this.libCode);
        }
    }

    private subscribeUpdate(update?: TLibraryUpdateProps) {
        if (!update) return;
        const { type, payload } = update;

        if (type == "delete" && payload.code == this.libCode) {
            this.selected = false; // Sync Model -> Attribute
        }
    }
}
