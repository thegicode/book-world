import { CustomFetch } from "../../utils/index";
import {
    BookDescription,
    BookImage,
    LibraryBookExist,
} from "../../components/index";
import store from "../../modules/store";

export default class FavoriteItem extends HTMLElement {
    protected libraryButton?: HTMLButtonElement;
    protected bookData: IUsageAnalysisResult | undefined;
    hideButton?: HTMLButtonElement | null;
    libraryBookExist?: LibraryBookExist | null;

    constructor() {
        super();
    }

    connectedCallback() {
        this.libraryButton = this.querySelector(
            ".library-button"
        ) as HTMLButtonElement;
        this.hideButton = this.querySelector(".hide-button");
        this.libraryBookExist = this.querySelector("library-book-exist");

        this.loading();

        this.fetchData(this.dataset.isbn as string);

        this.libraryButton.addEventListener("click", this.onLibrary.bind(this));
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

        if (this.libraryButton && Object.keys(store.libraries).length === 0) {
            this.libraryButton.hidden = true;
        }

        this.removeLoading();
    }

    private errorRender() {
        this.removeLoading();
        this.dataset.fail = "true";
        (
            this.querySelector("h4") as HTMLElement
        ).textContent = `ISBN : ${this.dataset.isbn}`;
        (this.querySelector(".authors") as HTMLElement).textContent =
            "정보가 없습니다.";
    }

    private onLibrary() {
        const isbn = this.dataset.isbn as string;
        if (this.libraryBookExist && this.libraryButton) {
            this.libraryBookExist.onLibraryBookExist(
                this.libraryButton,
                isbn,
                store.libraries
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

    private loading() {
        this.dataset.loading = "true";
    }

    private removeLoading() {
        delete this.dataset.loading;
    }
}
