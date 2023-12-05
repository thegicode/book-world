import { LibraryBookExist } from "../../components/index";
import bookModel from "../../model";
import renderBookItem from "./renderBooItem";

export default class BookItem extends HTMLElement {
    private libraryButton: HTMLButtonElement | null = null;
    private libraryExistComponent: LibraryBookExist | null = null;

    data!: ISearchBook; // 렌더링 되기전에 BookList에서  할당

    constructor() {
        super();

        this.libraryButton = this.querySelector(".library-button");
        this.libraryExistComponent =
            this.querySelector<LibraryBookExist>("library-book-exist");

        this.onLibraryButtonClick = this.onLibraryButtonClick.bind(this);
    }

    connectedCallback() {
        if (!this.data) {
            console.error("Book data is not provided");
            return;
        }

        this.addListeners();
        this.render();
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

    private render() {
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
        this.libraryExistComponent?.onLibraryBookExist(
            this.libraryButton,
            isbn,
            bookModel.getLibraries()
        );
    }
}
