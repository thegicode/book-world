import { BookImage } from "../../components/index";
import { CustomFetch } from "../../utils/index";

export default class Book extends HTMLElement {
    protected loadingElement: HTMLElement | null;
    protected data: IUsageAnalysisListData | null;

    recBookTemplate: HTMLTemplateElement | null;

    constructor() {
        super();
        this.loadingElement = null;
        this.data = null;

        this.recBookTemplate = document.querySelector("#tp-recBookItem");
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
            console.log(data);
            this.render();
        } catch (error) {
            this.renderError();
            console.error(error);
            throw new Error(`Fail to get usage analysis list.`);
        }
    }

    protected render(): void {
        if (!this.data) return;

        const { book, keywords, coLoanBooks, maniaRecBooks, readerRecBooks } =
            this.data; // coLoanBooks, loanGrps,loanHistory,

        this.renderBook(book);
        this.renderKeyword(keywords);
        this.renderCoLeanBooks(coLoanBooks);
        this.renderManiaBooks(maniaRecBooks);
        this.renderReaderBooks(readerRecBooks);

        if (this.loadingElement) {
            this.loadingElement.remove();
            this.loadingElement = null;
        }
    }

    renderBook(book: IBook) {
        const {
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
        } = book;

        const bookNames = bookname
            .split(/[=/:]/)
            .map((item) => `<p>${item}</p>`)
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

        const bookImageElement = this.querySelector<BookImage>("book-image");
        if (bookImageElement) {
            bookImageElement.data = {
                bookImageURL,
                bookname,
            };
        }
    }

    renderKeyword(keywords: IKeyword[]) {
        const keywordsString = keywords
            .map((item) => {
                const url = encodeURI(item.word);
                return `<a href="/search?keyword=${url}"><span>${item.word}</span></a>`;
            })
            .join("");

        (this.querySelector(".keyword") as HTMLElement).innerHTML =
            keywordsString;
    }

    renderCoLeanBooks(coLoanBooks: ICoLoanBooks[]) {
        const template = (
            document.querySelector("#tp-coLoanBookItem") as HTMLTemplateElement
        )?.content.firstElementChild;
        if (!template) return;

        const fragment = new DocumentFragment();
        coLoanBooks
            .map((book) => this.createRecItem(template, book))
            .forEach((el) => fragment.appendChild(el));

        this.querySelector(".coLoanBooks")?.appendChild(fragment);
    }

    renderManiaBooks(maniaRecBooks: IMainaBook[]) {
        const template = this.recBookTemplate?.content.firstElementChild;
        if (!template) return;

        const fragment = new DocumentFragment();
        maniaRecBooks
            .map((book) => this.createRecItem(template, book))
            .forEach((el) => fragment.appendChild(el));

        this.querySelector(".maniaBooks")?.appendChild(fragment);
    }

    renderReaderBooks(readerRecBooks: IReaderBook[]) {
        const template = this.recBookTemplate?.content.firstElementChild;
        if (!template) return;

        const fragment = new DocumentFragment();
        readerRecBooks
            .map((book) => this.createRecItem(template, book))
            .forEach((el) => fragment.appendChild(el));

        this.querySelector(".readerBooks")?.appendChild(fragment);
    }

    createRecItem(template: Element, book: IReaderBook) {
        const el = template.cloneNode(true) as HTMLElement;
        const { isbn13 } = book;

        for (const [key, value] of Object.entries(book)) {
            const node = el.querySelector(`.${key}`) as HTMLElement;
            node.textContent = value;
        }
        const link = el.querySelector("a");
        if (link) link.href = `book?isbn=${isbn13}`;

        return el;
    }

    protected renderError() {
        if (this.loadingElement)
            this.loadingElement.textContent = "정보를 가져올 수 없습니다.";
    }
}
