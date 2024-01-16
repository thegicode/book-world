import { CustomFetch } from "../../utils/index";
import { LibraryBookExist, LoadingComponent } from "../../components/index";
import bookModel from "../../model";
import FavoriteItemUI from "./FavoriteItemUI";

export default class FavoriteItem extends HTMLElement {
    private loadingComponent: LoadingComponent | null = null;
    private libraryBookExist?: LibraryBookExist | null;
    private _isbn: string | null = null;
    private ui: FavoriteItemUI;

    libraryButton?: HTMLButtonElement | null = null;
    hideButton?: HTMLButtonElement | null;

    constructor(isbn: string) {
        super();
        this._isbn = isbn;
        this.ui = new FavoriteItemUI(this);

        this.onLibrary = this.onLibrary.bind(this);
        this.onHideLibrary = this.onHideLibrary.bind(this);
    }

    get isbn() {
        return this._isbn;
    }

    connectedCallback() {
        this.loadingComponent = this.querySelector("loading-component");
        this.libraryButton = this.querySelector(".library-button");
        this.hideButton = this.querySelector(".hide-button");
        this.libraryBookExist = this.querySelector("library-book-exist");

        this.fetchData();

        this.libraryButton?.addEventListener("click", this.onLibrary);
        this.hideButton?.addEventListener("click", this.onHideLibrary);
    }

    disconnectedCallback() {
        this.libraryButton?.removeEventListener("click", this.onLibrary);
        this.hideButton?.removeEventListener("click", this.onHideLibrary);
    }

    protected async fetchData() {
        const url = `/usage-analysis-list?isbn13=${this._isbn}`;
        try {
            const data = await CustomFetch.fetch<IUsageAnalysisResult>(url);
            this.renderUI(data.book);
        } catch (error) {
            this.ui.renderError();
            console.error(`${error}, Fail to get usage-analysis-list.`);
        }

        this.loadingComponent?.hide();
    }

    protected renderUI(book: IBook) {
        delete book.vol;
        this.ui.render(book);
    }

    private onLibrary() {
        if (!this.libraryBookExist || !this.libraryButton) return;

        this.libraryBookExist.onLibraryBookExist(
            this.libraryButton,
            this._isbn as string,
            bookModel.libraries
        );

        this.ui.updateOnLibrary();
    }

    onHideLibrary() {
        const list = this.libraryBookExist?.querySelector(
            "ul"
        ) as HTMLUListElement;

        list.innerHTML = "";

        this.ui.updateOnHideLibrary();
    }
}
