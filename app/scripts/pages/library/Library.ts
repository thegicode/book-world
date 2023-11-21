import { CustomFetch } from "../../utils/index";
import LibraryItem from "./LibraryItem";
import { cloneTemplate } from "../../utils/helpers";
import bookStore from "../../modules/BookStore";

export default class Library extends HTMLElement {
    private _regionCode: string | null = null;
    private form?: HTMLFormElement;
    private readonly PAGE_SIZE = 20;
    private template: HTMLTemplateElement;

    constructor() {
        super();
        this.template = document.querySelector(
            "#tp-item"
        ) as HTMLTemplateElement;
    }

    set regionCode(value) {
        this._regionCode = value;
        this.handleRegionCodeChange();
    }

    get regionCode() {
        return this._regionCode;
    }

    connectedCallback() {
        this.form = this.querySelector("form") as HTMLFormElement;
    }

    protected async fetchLibrarySearch(detailRegionCode: string) {
        const url = `/library-search?dtl_region=${detailRegionCode}&page=1&pageSize=${this.PAGE_SIZE}`;
        try {
            const data = await CustomFetch.fetch<ILibrarySearchByBookResult>(
                url
            );
            this.render(data);
        } catch (error) {
            console.error(error);
            throw new Error("Fail to get library search data.");
        }
    }

    protected render(data: ILibrarySearchByBookResult) {
        const { template } = this;
        if (!template) return;

        const {
            // pageNo, pageSize, numFound, resultNum,
            libraries,
        } = data;

        if (libraries.length === 0) {
            this.showMessage("notFound");
            return;
        }

        const fragment = libraries.reduce(
            (fragment: DocumentFragment, lib: ILibrary) => {
                const libraryItem = cloneTemplate<LibraryItem>(template);
                libraryItem.data = lib;

                if (bookStore.hasLibrary(lib.libCode)) {
                    libraryItem.dataset.has = "true";
                    fragment.prepend(libraryItem);
                    // fragment.insertBefore(libraryItem, fragment.firstChild);
                } else {
                    fragment.appendChild(libraryItem);
                }
                return fragment;
            },
            new DocumentFragment()
        );

        if (this.form) {
            this.form.innerHTML = "";
            this.form.appendChild(fragment);
        }
    }

    protected showMessage(type: string) {
        const template = document.querySelector(
            `#tp-${type}`
        ) as HTMLTemplateElement;
        if (template && this.form) {
            this.form.innerHTML = "";
            const clone = cloneTemplate(template);
            this.form.appendChild(clone);
        }
    }

    private handleRegionCodeChange() {
        this.showMessage("loading");
        if (this.regionCode) this.fetchLibrarySearch(this.regionCode);
    }
}
