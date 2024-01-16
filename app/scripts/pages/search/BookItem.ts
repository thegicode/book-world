import { LibraryBookExist } from "../../components/index";
import bookModel from "../../model";
import renderBookItem from "./renderBooItem";

export default class BookItem extends HTMLElement {
    private data: ISearchBook;
    private libraryButton: HTMLButtonElement | null = null;
    private libraryBookExist: LibraryBookExist | null = null;

    constructor(data: ISearchBook) {
        super();

        this.data = data;
        this.onLibraryButtonClick = this.onLibraryButtonClick.bind(this);
    }

    connectedCallback() {
        this.renderView();

        this.libraryButton = this.querySelector(
            ".library-button"
        ) as HTMLButtonElement;

        this.libraryBookExist = this.querySelector(
            "library-book-exist"
        ) as LibraryBookExist;

        this.libraryButton.addEventListener("click", this.onLibraryButtonClick);
    }

    disconnectedCallback() {
        this.libraryButton?.removeEventListener(
            "click",
            this.onLibraryButtonClick
        );
    }

    private renderView() {
        const { discount, pubdate, ...others } = this.data;

        const renderData = {
            ...others,
            discount: Number(discount).toLocaleString(),
            pubdate: this.getPubdate(pubdate),
        };

        renderBookItem(this, renderData);
    }

    private getPubdate(pubdate: string) {
        return `${pubdate.substring(0, 4)}.${pubdate.substring(
            4,
            6
        )}.${pubdate.substring(6)}`;
    }

    // 도서관 소장 | 대출 조회
    private onLibraryButtonClick() {
        this.libraryBookExist?.onLibraryBookExist(
            this.libraryButton,
            this.dataset.isbn || "",
            bookModel.libraries
        );
    }
}
