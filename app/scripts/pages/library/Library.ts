import { CustomFetch } from "../../utils/index";
import LibraryItem from "./LibraryItem";
import { cloneTemplate } from "../../utils/helpers";
import bookStore from "../../modules/BookStore";

export default class Library extends HTMLElement {
    private _regionCode: string | null = null;
    private readonly PAGE_SIZE = 20;
    private formElement?: HTMLFormElement;
    private itemTemplate: HTMLTemplateElement;

    constructor() {
        super();

        this.formElement = this.querySelector("form") as HTMLFormElement;
        this.itemTemplate = document.querySelector(
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
        // start- library-header
    }

    private handleRegionCodeChange() {
        if (!this.regionCode) return;

        this.showMessage("loading");
        this.fetchLibrarySearch(this.regionCode);
    }

    protected async fetchLibrarySearch(regionCode: string) {
        const url = `/library-search?dtl_region=${regionCode}&page=1&pageSize=${this.PAGE_SIZE}`;
        try {
            const data = await CustomFetch.fetch<ILibrarySearchByBookResult>(
                url
            );
            this.renderLibraryList(data);
        } catch (error) {
            console.error(error);
            throw new Error("Fail to get library search data.");
        }
    }

    protected renderLibraryList(data: ILibrarySearchByBookResult) {
        const {
            // pageNo, pageSize, numFound, resultNum,
            libraries,
        } = data;

        if (libraries.length === 0) {
            this.showMessage("notFound");
            return;
        }

        const fragment = libraries.reduce(
            (fragment: DocumentFragment, lib: ILibrary) =>
                this.createLibraryItem(fragment, lib),
            new DocumentFragment()
        );

        if (this.formElement) {
            this.formElement.innerHTML = "";
            this.formElement.appendChild(fragment);
        }
    }

    private createLibraryItem(fragment: DocumentFragment, lib: ILibrary) {
        const libraryItem = cloneTemplate<LibraryItem>(this.itemTemplate);
        libraryItem.data = lib;

        if (bookStore.hasLibrary(lib.libCode)) {
            libraryItem.dataset.has = "true";
            fragment.prepend(libraryItem);
            // fragment.insertBefore(libraryItem, fragment.firstChild);
        } else {
            fragment.appendChild(libraryItem);
        }
        return fragment;
    }

    protected showMessage(type: string) {
        const template = document.querySelector(
            `#tp-${type}`
        ) as HTMLTemplateElement;

        if (template && this.formElement) {
            this.formElement.innerHTML = "";
            const clone = cloneTemplate(template);
            this.formElement.appendChild(clone);
        }
    }
}
