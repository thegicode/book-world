import LibraryItem from "./LibraryItem";
import bookModel from "../../model";
import { FetchListComponent } from "../../components/FetchListComponent";
import { cloneTemplate } from "../../utils/helpers";

export default class Library extends FetchListComponent<
    ILibrarySearchByBookResult,
    ILibraryData
> {
    private _regionCode: string | null = null;
    private readonly PAGE_SIZE = 20;

    constructor() {
        super();
        this.itemTemplate = document.querySelector(
            "#tp-item"
        ) as HTMLTemplateElement;
    }

    set regionCode(value: string | null) {
        this._regionCode = value;
        this.handleRegionCodeChange();
    }

    get regionCode(): string | null {
        return this._regionCode;
    }

    private handleRegionCodeChange() {
        if (!this.regionCode) return;

        this.listContainer.innerHTML = "";
        const url = `/library-search?dtl_region=${this.regionCode}&page=1&pageSize=${this.PAGE_SIZE}`;
        this.fetchData(url);
    }

    // --- Implementation of abstract/overridden methods from FetchListComponent ---

    protected getItems(data: ILibrarySearchByBookResult): ILibraryData[] {
        return data.libraries;
    }

    protected getTotal(data: ILibrarySearchByBookResult): number {
        return data.libraries.length;
    }

    protected createItem(lib: ILibraryData): HTMLElement {
        const libraryItem = cloneTemplate<LibraryItem>(this.itemTemplate!);
        libraryItem.data = lib;
        return libraryItem;
    }

    /**
     * @override
     * Sorts libraries to show favorite ones first, then renders the list.
     */
    protected renderList(items: ILibraryData[]): void {
        // Clear previous list
        this.listContainer.innerHTML = "";

        const fragment = new DocumentFragment();
        const sortedItems = [...items].sort((a, b) => {
            const aHas = bookModel.hasLibrary(a.libCode);
            const bHas = bookModel.hasLibrary(b.libCode);
            if (aHas === bHas) return 0;
            return aHas ? -1 : 1; // if 'a' is a favorite, it comes first.
        });

        sortedItems
            .map((item) => this.createItem(item)) // index is not used here
            .forEach((itemElement) => {
                if (itemElement) {
                    // Mark favorite items visually
                    if (
                        bookModel.hasLibrary(
                            (itemElement as LibraryItem).data.libCode
                        )
                    ) {
                        itemElement.dataset.has = "true";
                    }
                    fragment.appendChild(itemElement);
                }
            });

        this.listContainer.appendChild(fragment);
    }

    protected onRenderComplete(): void {
        // No specific action needed after rendering for this component
    }
}