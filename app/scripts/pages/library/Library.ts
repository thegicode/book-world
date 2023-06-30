import { CustomEventEmitter, CustomFetch } from "../../utils/index";
import { hasLibrary } from "../../modules/model";
import LibraryItem from "./LibraryItem";

export default class Library extends HTMLElement {
    private form?: HTMLFormElement;
    private readonly PAGE_SIZE = 20;
    private readonly EVENT_NAME = "set-detail-region";

    constructor() {
        super();
        this.handleDetailRegion = this.handleDetailRegion.bind(this);
    }

    connectedCallback() {
        this.form = this.querySelector("form") as HTMLFormElement;
        CustomEventEmitter.add(
            this.EVENT_NAME,
            this.handleDetailRegion as EventListener
        );
    }

    disconnectedCallback() {
        CustomEventEmitter.remove(
            this.EVENT_NAME,
            this.handleDetailRegion as EventListener
        );
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
        const {
            // pageNo, pageSize, numFound, resultNum,
            libraries,
        } = data;

        if (libraries.length === 0) {
            this.showMessage("notFound");
            return;
        }

        const template = document.querySelector(
            "#tp-item"
        ) as HTMLTemplateElement;
        const fragment = libraries.reduce(
            (fragment: DocumentFragment, lib: ILibrary) => {
                if (template?.content.firstElementChild) {
                    const libraryItem =
                        template.content.firstElementChild.cloneNode(
                            true
                        ) as LibraryItem;
                    libraryItem.dataset.object = JSON.stringify(lib);

                    if (hasLibrary(lib.libCode)) {
                        libraryItem.dataset.has = "true";
                        fragment.prepend(libraryItem);
                        // fragment.insertBefore(libraryItem, fragment.firstChild);
                    } else {
                        fragment.appendChild(libraryItem);
                    }
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
        if (template?.content.firstElementChild && this.form) {
            this.form.innerHTML = "";
            this.form.appendChild(
                template.content.firstElementChild.cloneNode(true)
            );
        }
    }

    protected handleDetailRegion(
        evt: ICustomEvent<{ detailRegionCode: string }>
    ) {
        this.showMessage("loading");
        this.fetchLibrarySearch(evt.detail.detailRegionCode);
    }
}
