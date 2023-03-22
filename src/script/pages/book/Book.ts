import { BookImage } from "../../components/index.js";
import { CustomFetch } from "../../utils/index.js";

interface BookData {
    bookname: string;
    authors: string;
    bookImageURL: string;
    class_nm: string;
    class_no: string;
    description: string;
    isbn13: string;
    loanCnt: number;
    publication_year: string;
    publisher: string;
}

interface KeywordData {
    word: string;
}

interface RecBookData {
    bookname: string;
    isbn13: string;
}

interface UsageAnalysisListData {
    book: BookData;
    keywords: KeywordData[];
    recBooks: RecBookData[];
}

export default class Book extends HTMLElement {
    private loadingElement: HTMLElement;
    private data: UsageAnalysisListData | null;

    constructor() {
        super();
        this.loadingElement = this.querySelector(".loading") as HTMLElement;
        this.data = null;
    }

    connectedCallback(): void {
        const isbn = new URLSearchParams(location.search).get("isbn") as string;
        this.dataset.isbn = isbn;
        this.fetchUsageAnalysisList(isbn);
    }

    private async fetchUsageAnalysisList(isbn: string): Promise<void> {
        try {
            const data = await CustomFetch.fetch<UsageAnalysisListData>(
                `/usage-analysis-list?isbn13=${isbn}`
            );
            this.data = data;
            this.render();
        } catch (error) {
            this.renderError();
            console.error(error);
            throw new Error(`Fail to get usage analysis list.`);
        }
    }

    private render(): void {
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
            recBooks,
        } = this.data; // coLoanBooks, loanGrps,loanHistory,

        const bookNames = bookname
            .split(/[=/:]/)
            .map((item) => `<p>${item}</p>`)
            .join("");
        const keywordsString = keywords
            .map((item) => `<span>${item.word}</span>`)
            .join("");
        const recBooksString = recBooks
            .map(
                ({ bookname, isbn13 }) =>
                    `<li><a href=book?isbn=${isbn13}>${bookname}</a></li>`
            )
            .join("");

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
        (this.querySelector(".recBooks") as HTMLElement).innerHTML =
            recBooksString;

        const bookImageElement = this.querySelector<BookImage>("book-image");
        if (bookImageElement) {
            bookImageElement.data = {
                bookImageURL,
                bookname,
            };
        }

        this.loadingElement.remove();
    }

    private renderError() {
        this.loadingElement.textContent = "정보를 가져올 수 없습니다.";
    }
}
