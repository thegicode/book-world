import { CustomFetch } from "../../utils/index";
import {
    BookDescription,
    BookImage,
    LibraryBookExist,
    LoadingComponent,
} from "../../components/index";
import bookModel from "../../model";

export default class FavoriteItem extends HTMLElement {
    protected libraryButton?: HTMLButtonElement | null = null;
    protected bookData: IUsageAnalysisResult | undefined;
    private loadingComponent: LoadingComponent | null = null;
    private hideButton?: HTMLButtonElement | null;
    private libraryBookExist?: LibraryBookExist | null;
    private _isbn: string | null = null;

    constructor(isbn: string) {
        super();
        this._isbn = isbn;
    }

    connectedCallback() {
        this.loadingComponent = this.querySelector("loading-component");
        this.libraryButton = this.querySelector(".library-button");
        this.hideButton = this.querySelector(".hide-button");
        this.libraryBookExist = this.querySelector("library-book-exist");

        this.fetchData(this._isbn as string);

        this.libraryButton?.addEventListener(
            "click",
            this.onLibrary.bind(this)
        );
        this.hideButton?.addEventListener(
            "click",
            this.onHideLibrary.bind(this)
        );
    }

    disconnectedCallback() {
        this.libraryButton?.removeEventListener("click", this.onLibrary);
        this.hideButton?.removeEventListener("click", this.onHideLibrary);
    }

    protected async fetchData(isbn: string) {
        const url = `/usage-analysis-list?isbn13=${isbn}`;
        try {
            const data = await CustomFetch.fetch<IUsageAnalysisResult>(url);
            this.render(data);
        } catch (error) {
            this.errorRender();
            console.error(error);
            throw new Error(`Fail to get usage analysis list.`);
        }

        this.loadingComponent?.hide();
    }

    protected render(data: IUsageAnalysisResult) {
        this.bookData = data;

        const {
            bookImageURL,
            ...otherData
            // bookname, isbn13, authors,  class_nm,  class_no, description, loanCnt,  publication_year, publisher,
        } = data.book;

        const bookname = data.book.bookname;

        const imageNode = this.querySelector<BookImage>("book-image");
        if (imageNode) {
            imageNode.data = {
                bookImageURL,
                bookname,
            };
        }

        Object.entries(otherData).forEach(([key, value]) => {
            if (key === "description") {
                const descNode =
                    this.querySelector<BookDescription>("book-description");
                if (descNode) descNode.data = value as string;
            } else {
                const element = this.querySelector(`.${key}`) as HTMLElement;
                if (element) element.textContent = value as string;
            }
        });

        const anchorEl = this.querySelector("a") as HTMLAnchorElement;
        if (anchorEl) anchorEl.href = `/book?isbn=${data.book.isbn13}`;

        if (
            this.libraryButton &&
            Object.keys(bookModel.getLibraries()).length === 0
        ) {
            this.libraryButton.hidden = true;
        }
    }

    private errorRender() {
        this.dataset.fail = "true";
        (
            this.querySelector("h4") as HTMLElement
        ).textContent = `ISBN : ${this._isbn}`;
        (this.querySelector(".authors") as HTMLElement).textContent =
            "정보가 없습니다.";
    }

    private onLibrary() {
        const isbn = this._isbn as string;
        if (this.libraryBookExist && this.libraryButton) {
            this.libraryBookExist.onLibraryBookExist(
                this.libraryButton,
                isbn,
                bookModel.getLibraries()
            );
            if (this.libraryButton) {
                this.libraryButton.hidden = true;
            }
            if (this.hideButton) {
                this.hideButton.hidden = false;
            }
        }
    }

    onHideLibrary() {
        const list = this.libraryBookExist?.querySelector(
            "ul"
        ) as HTMLUListElement;
        list.innerHTML = "";

        if (this.libraryButton) {
            this.libraryButton.disabled = false;
            this.libraryButton.hidden = false;
        }

        if (this.hideButton) {
            this.hideButton.hidden = true;
        }
    }

    // private loading() {
    //     if (this.loadingComponent) this.loadingComponent.hidden = false;
    // }

    // private removeLoading() {
    //     if (this.loadingComponent) this.loadingComponent.hidden = true;
    // }
}
