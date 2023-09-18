import { CustomFetch } from "../../utils/index";
import { state } from "../../modules/model";
import {
    BookDescription,
    BookImage,
    LibraryBookExist,
} from "../../components/index";

export default class FavoriteItem extends HTMLElement {
    protected libraryButton?: HTMLButtonElement;
    protected anchorElement?: HTMLAnchorElement;
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
        this.anchorElement = this.querySelector("a") as HTMLAnchorElement;

        this.loading();

        this.fetchData(this.dataset.isbn as string);

        this.libraryButton.addEventListener("click", this.onLibrary.bind(this));
        this.hideButton?.addEventListener(
            "click",
            this.onHideLibrary.bind(this)
        );
        this.anchorElement.addEventListener("click", this.onClick.bind(this));
    }

    disconnectedCallback() {
        this.libraryButton?.removeEventListener("click", this.onLibrary);
        this.hideButton?.removeEventListener("click", this.onHideLibrary);
        this.anchorElement?.removeEventListener("click", this.onClick);
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
        const {
            book,
            // loanHistory,
            // loanGrps,
            // keywords,
            // recBooks,
            // coLoanBooks
        } = data;

        const {
            authors,
            bookImageURL,
            bookname,
            class_nm,
            // class_no,
            description,
            isbn13,
            loanCnt,
            publication_year,
            publisher,
            // vol
        } = book;

        this.bookData = data;

        (this.querySelector(".bookname") as HTMLElement).textContent = bookname;
        (this.querySelector(".authors") as HTMLElement).textContent = authors;

        const classNm = this.querySelector(".class_nm") as HTMLElement;
        if (class_nm === " >  > ") {
            classNm.remove();
        } else {
            classNm.textContent = class_nm;
        }

        (this.querySelector(".isbn13") as HTMLElement).textContent = isbn13;
        (this.querySelector(".loanCnt") as HTMLElement).textContent =
            loanCnt.toLocaleString();
        (this.querySelector(".publication_year") as HTMLElement).textContent =
            publication_year;
        (this.querySelector(".publisher") as HTMLElement).textContent =
            publisher;
        const descriptionElement =
            this.querySelector<BookDescription>("book-description");
        if (descriptionElement) {
            descriptionElement.data = description;
        }
        const imageElement = this.querySelector<BookImage>("book-image");
        if (imageElement) {
            imageElement.data = {
                bookImageURL,
                bookname,
            };
        }

        if (this.libraryButton && Object.keys(state.libraries).length === 0) {
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
                state.libraries
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

    protected onClick(event: MouseEvent) {
        event.preventDefault();
        location.href = `book?isbn=${this.dataset.isbn}`;
    }
}
