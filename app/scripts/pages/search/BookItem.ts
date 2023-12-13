import { LibraryBookExist } from "../../components/index";
import bookModel from "../../model";
import renderBookItem from "./renderBooItem";

export default class BookItem extends HTMLElement {
    private data: ISearchBook;
    private libraryButton: HTMLButtonElement | null = null;

    constructor(data: ISearchBook) {
        super();

        this.data = data;
        this.onLibraryButtonClick = this.onLibraryButtonClick.bind(this);
    }

    connectedCallback() {
        this.renderView();

        this.libraryButton = this.querySelector(".library-button");

        this.addListeners();
    }

    disconnectedCallback() {
        this.removeListeners();
    }

    private addListeners() {
        this.libraryButton?.addEventListener(
            "click",
            this.onLibraryButtonClick
        );
    }

    private removeListeners() {
        this.libraryButton?.removeEventListener(
            "click",
            this.onLibraryButtonClick
        );
    }

    private renderView() {
        const { discount, pubdate, ...others } = this.data;

        const _pubdate = `${pubdate.substring(0, 4)}.${pubdate.substring(
            4,
            6
        )}.${pubdate.substring(6)}`;

        const renderData = {
            ...others,
            discount: Number(discount).toLocaleString(),
            pubdate: _pubdate,
        };

        renderBookItem(this, renderData);
    }

    // 도서관 소장 | 대출 조회
    private onLibraryButtonClick() {
        const isbn = this.dataset.isbn || "";
        const libraryBookExist = this.querySelector(
            "library-book-exist"
        ) as LibraryBookExist;
        libraryBookExist.onLibraryBookExist(
            this.libraryButton,
            isbn,
            bookModel.libraries
        );
    }
}
