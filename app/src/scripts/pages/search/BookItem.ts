import {
    BookDescription,
    BookImage,
    LibraryBookExist,
} from "../../components/index";
import bookModel from "../../model";
import { fillElementsWithData } from "../../utils/helpers";

export default class BookItem extends HTMLElement {
    private data: ISearchBook;
    private template: HTMLTemplateElement;
    private libraryButton: HTMLButtonElement | null = null;
    private libraryBookExist: LibraryBookExist | null = null;

    constructor(data: ISearchBook, template: HTMLTemplateElement) {
        super();

        this.data = data;
        this.template = template;

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

        const cloned = this.template.content.cloneNode(true);
        this.appendChild(cloned);

        this.renderContents(renderData);
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

    private renderContents(data: ISearchBook) {
        const {
            description,
            image,
            isbn,
            link,
            title,
            ...otherData // author, discount, pubdate, publisher
        } = data;

        // 썸네일 이미지
        const summaryLinkElement = this.querySelector(
            ".book-summary a"
        ) as HTMLAnchorElement;
        const bookImage = new BookImage(image, title);
        summaryLinkElement.appendChild(bookImage);

        // 네이버 바로가기
        const linkEl = this.querySelector(".link") as HTMLAnchorElement;
        linkEl.href = link;

        // description
        const descriptionEl = this.querySelector(
            "book-description"
        ) as BookDescription;
        if (descriptionEl) descriptionEl.data = description as string;

        // 상세화면 이동
        const anchorEl = this.querySelector("a") as HTMLAnchorElement;
        anchorEl.href = `/book?isbn=${isbn}`;

        // element.textContent
        fillElementsWithData({ ...otherData, title }, this);

        this.dataset.isbn = isbn;
    }
}
