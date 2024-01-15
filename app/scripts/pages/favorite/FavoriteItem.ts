import { CustomFetch } from "../../utils/index";
import { LibraryBookExist, LoadingComponent } from "../../components/index";
import bookModel from "../../model";
import FavoriteItemView from "./FavoriteItemView";

export default class FavoriteItem extends HTMLElement {
    private loadingComponent: LoadingComponent | null = null;
    private libraryBookExist?: LibraryBookExist | null;
    private libraryButton?: HTMLButtonElement | null = null;
    private hideButton?: HTMLButtonElement | null;
    private _isbn: string | null = null;
    private view: FavoriteItemView;

    constructor(isbn: string) {
        super();
        this._isbn = isbn;
        this.view = new FavoriteItemView(this);
    }

    connectedCallback() {
        this.loadingComponent = this.querySelector("loading-component");
        this.libraryButton = this.querySelector(".library-button");
        this.hideButton = this.querySelector(".hide-button");
        this.libraryBookExist = this.querySelector("library-book-exist");

        this.addEvents();

        this.fetchData();
    }

    disconnectedCallback() {
        this.removeEvents();
    }

    get isbn() {
        return this._isbn;
    }

    private addEvents() {
        this.libraryButton?.addEventListener(
            "click",
            this.onLibrary.bind(this)
        );
        this.hideButton?.addEventListener(
            "click",
            this.onHideLibrary.bind(this)
        );
    }

    private removeEvents() {
        this.libraryButton?.removeEventListener("click", this.onLibrary);
        this.hideButton?.removeEventListener("click", this.onHideLibrary);
    }

    protected async fetchData() {
        const url = `/usage-analysis-list?isbn13=${this._isbn}`;
        try {
            const data = await CustomFetch.fetch<IUsageAnalysisResult>(url);
            this.renderView(data);
        } catch (error) {
            this.view.renderError();
            console.error(error);
            throw new Error(`Fail to get usage analysis list.`);
        }

        this.loadingComponent?.hide();
    }

    protected renderView(data: IUsageAnalysisResult) {
        const newData = data.book;
        delete newData.vol;

        this.view.render(newData);
    }

    private onLibrary() {
        if (this.libraryBookExist && this.libraryButton) {
            this.libraryBookExist.onLibraryBookExist(
                this.libraryButton,
                this._isbn as string,
                bookModel.libraries
            );

            this.view.updateOnLibrary();
        }
    }

    onHideLibrary() {
        const list = this.libraryBookExist?.querySelector(
            "ul"
        ) as HTMLUListElement;

        list.innerHTML = "";

        this.view.updateOnHideLibrary();
    }
}
