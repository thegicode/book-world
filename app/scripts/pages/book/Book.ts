import { BookImage } from "../../components/index";
import { CustomFetch } from "../../utils/index";

export default class Book extends HTMLElement {
    protected loadingElement: HTMLElement | null;
    protected data: IUsageAnalysisListData | null;

    constructor() {
        super();
        this.loadingElement = null;
        this.data = null;
    }

    connectedCallback(): void {
        this.loadingElement = this.querySelector(".loading") as HTMLElement;

        const isbn = new URLSearchParams(location.search).get("isbn") as string;
        this.dataset.isbn = isbn;
        this.fetchUsageAnalysisList(isbn);
    }

    protected async fetchUsageAnalysisList(isbn: string): Promise<void> {
        try {
            const data = await CustomFetch.fetch<IUsageAnalysisListData>(
                `/usage-analysis-list?isbn13=${isbn}`
            );
            this.data = data;
            // console.log(data);
            this.render();
        } catch (error) {
            this.renderError();
            console.error(error);
            throw new Error(`Fail to get usage analysis list.`);
        }
    }

    protected render(): void {
        if (!this.data) return;

        const {
            book: {
                bookname,
                authors,
                bookImageURL,
                class_nm,
                class_no,
                description,
                isbn13,
                loanCnt,
                publication_year,
                publisher,
            },
            keywords,
            // recBooks,
        } = this.data; // coLoanBooks, loanGrps,loanHistory,

        const bookNames = bookname
            .split(/[=/:]/)
            .map((item) => `<p>${item}</p>`)
            .join("");

        const keywordsString = keywords
            .map((item) => {
                const url = encodeURI(item.word);
                return `<a href="/search?keyword=${url}"><span>${item.word}</span></a>`;
            })
            .join("");

        // const recBooksString = recBooks
        //     .map(
        //         ({ bookname, isbn13 }) =>
        //             `<li><a href=book?isbn=${isbn13}>${bookname}</a></li>`
        //     )
        //     .join("");

        (this.querySelector(".bookname") as HTMLElement).innerHTML = bookNames;
        (this.querySelector(".authors") as HTMLElement).textContent = authors;
        (this.querySelector(".class_nm") as HTMLElement).textContent = class_nm;
        (this.querySelector(".class_no") as HTMLElement).textContent = class_no;
        (this.querySelector(".description") as HTMLElement).textContent =
            description;
        (this.querySelector(".isbn13") as HTMLElement).textContent = isbn13;
        (this.querySelector(".loanCnt") as HTMLElement).textContent =
            loanCnt.toLocaleString();
        (this.querySelector(".publication_year") as HTMLElement).textContent =
            publication_year;
        (this.querySelector(".publisher") as HTMLElement).textContent =
            publisher;
        (this.querySelector(".keyword") as HTMLElement).innerHTML =
            keywordsString;
        // (this.querySelector(".recBooks") as HTMLElement).innerHTML =
        //     recBooksString;

        const bookImageElement = this.querySelector<BookImage>("book-image");
        if (bookImageElement) {
            bookImageElement.data = {
                bookImageURL,
                bookname,
            };
        }

        if (this.loadingElement) {
            this.loadingElement.remove();
            this.loadingElement = null;
        }
    }

    protected renderError() {
        if (this.loadingElement)
            this.loadingElement.textContent = "정보를 가져올 수 없습니다.";
    }
}
