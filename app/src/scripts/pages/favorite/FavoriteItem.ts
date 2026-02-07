import { CustomFetch } from "../../services/index";
import { LibraryBookExist, LoadingComponent } from "../../components/index";
import bookModel from "../../model";
import FavoriteItemUI from "./FavoriteItemUI";
import KyoboInfo from "./KyoboInfo";
import BaseItemComponent from "../../components/BaseItemComponent";

export default class FavoriteItem extends BaseItemComponent {
    private loadingComponent: LoadingComponent | null = null;
    private _isbn: string | null = null;
    private kyoboButton: HTMLButtonElement | null = null;
    private kyoboInfoCpnt: KyoboInfo | null = null;
    private ui: FavoriteItemUI;

    libraryBookExist?: LibraryBookExist | null;
    libraryButton?: HTMLButtonElement | null = null;
    libraryHideButton?: HTMLButtonElement | null;

    constructor(isbn: string, template: HTMLTemplateElement) {
        super(template);
        this._isbn = isbn;
        this.dataset.isbn = isbn;
        this.ui = new FavoriteItemUI(this);

        this.onLibrary = this.onLibrary.bind(this);
        this.onHideLibrary = this.onHideLibrary.bind(this);
        this.onShowKyobo = this.onShowKyobo.bind(this);
    }

    get isbn() {
        return this._isbn;
    }

    protected onMount() {
        this.loadingComponent = this.querySelector("loading-component");
        this.libraryButton = this.querySelector(".library-button");
        this.libraryHideButton = this.querySelector(".hide-button");
        this.libraryBookExist = this.querySelector("library-book-exist");
        this.kyoboButton = this.querySelector(".kyoboInfo-button");
        this.kyoboInfoCpnt = this.querySelector("kyobo-info");

        this.fetchData();

        this.libraryButton?.addEventListener("click", this.onLibrary);
        this.libraryHideButton?.addEventListener("click", this.onHideLibrary);
        this.kyoboButton?.addEventListener("click", this.onShowKyobo);
    }

    disconnectedCallback() {
        this.libraryButton?.removeEventListener("click", this.onLibrary);
        this.libraryHideButton?.removeEventListener(
            "click",
            this.onHideLibrary
        );
    }

    protected async fetchData() {
        const url = `/usage-analysis-list?isbn13=${this._isbn}`;
        try {
            const response = await CustomFetch.fetch<IApiResponse<IUsageAnalysisResult>>(url);
            if (response.status === 'success') {
                this.renderUI(response.data.book);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            this.ui.renderError();
            console.error(`${error}, Fail to get usage-analysis-list.`);
        }

        this.loadingComponent?.hide();
    }

    protected renderUI(book: IBook) {
        // The original implementation deleted vol, which is a side effect on the cached data.
        // It's better to create a new object without it.
        const { vol, ...renderData } = book;
        this.ui.render(renderData as IBook);
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

    private onShowKyobo() {
        if (!this.kyoboInfoCpnt) return;

        if (this.kyoboInfoCpnt.hidden) {
            this.kyoboInfoCpnt.show();
        } else {
            this.kyoboInfoCpnt.hide();
        }
    }
}