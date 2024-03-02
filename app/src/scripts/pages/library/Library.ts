import { CustomFetch } from "../../utils/index";
import LibraryItem from "./LibraryItem";
import { cloneTemplate } from "../../utils/helpers";
import bookModel from "../../model";
import { LoadingComponent } from "../../components";

export default class Library extends HTMLElement {
    private _regionCode: string | null = null;
    private readonly PAGE_SIZE = 20;
    private listElement?: HTMLElement;
    private itemTemplate: HTMLTemplateElement;
    private loadingComponent: LoadingComponent | null;

    constructor() {
        super();

        this.listElement = this.querySelector(".library-list") as HTMLElement;
        this.itemTemplate = document.querySelector(
            "#tp-item"
        ) as HTMLTemplateElement;
        this.loadingComponent =
            this.querySelector<LoadingComponent>("loading-component");
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

        this.fetchLibrarySearch(this.regionCode);
    }

    protected async fetchLibrarySearch(regionCode: string) {
        if (this.listElement) this.listElement.innerHTML = "";
        this.loadingComponent?.show();

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

        this.loadingComponent?.hide();
    }

    protected renderLibraryList(data: ILibrarySearchByBookResult) {
        if (!this.listElement) return;
        const {
            // pageNo, pageSize, numFound, resultNum,
            libraries,
        } = data;

        if (libraries.length === 0) {
            this.showMessage("notFound");
            return;
        }

        const fragment = libraries.reduce(
            (fragment: DocumentFragment, lib: ILibraryData) =>
                this.createLibraryItem(fragment, lib),
            new DocumentFragment()
        );

        this.listElement.appendChild(fragment);
    }

    private createLibraryItem(fragment: DocumentFragment, lib: ILibraryData) {
        const libraryItem = cloneTemplate<LibraryItem>(this.itemTemplate);
        libraryItem.data = lib;

        if (bookModel.hasLibrary(lib.libCode)) {
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

        if (template && this.listElement) {
            this.listElement.innerHTML = "";
            const clone = cloneTemplate(template);
            this.listElement.appendChild(clone);
        }
    }
}
