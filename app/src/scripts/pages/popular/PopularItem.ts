import { BaseItemComponent } from "../../components";
import { fillElementsWithData } from "../../utils/helpers";
import { BookImage } from "../../components";

export default class PopularItem extends BaseItemComponent {
    private data: IPopularBook;

    constructor(data: IPopularBook) {
        super("/html/templates/popular-item.html");
        this.data = data;
    }

    protected onMount(): void {
        this.render();
    }

    private render() {
        const {
            bookImageURL,
            bookDtlUrl,
            isbn13,
            ...otherData
        } = this.data;

        this.dataset.isbn = isbn13;

        const linkEl = this.querySelector(".link") as HTMLLinkElement;
        linkEl.insertBefore(
            new BookImage(bookImageURL, otherData.bookname),
            linkEl.querySelector(".ranking")
        );

        const bookDtlUrlNode = this.querySelector(
            ".bookDtlUrl"
        ) as HTMLAnchorElement;
        if (bookDtlUrlNode) {
            bookDtlUrlNode.href = bookDtlUrl;
        }
        
        fillElementsWithData(otherData, this);

        const anchorEl = this.querySelector("a") as HTMLAnchorElement;
        if (anchorEl) anchorEl.href = `/book?isbn=${isbn13}`;
    }
}
