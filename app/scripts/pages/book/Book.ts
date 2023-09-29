import { BookImage } from "../../components/index";
import { CustomFetch } from "../../utils/index";
import { cloneTemplate } from "../../utils/utils";

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

    connectedCallback() {
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

    protected render() {
        if (!this.data) {
            console.error("Data is null");
            return;
        }

        const {
            book,
            keywords,
            coLoanBooks,
            loanGrps,
            maniaRecBooks,
            readerRecBooks,
        } = this.data; // coLoanBooks, loanGrps,loanHistory,

        this.renderBook(book);
        this.renderLoanGroups(loanGrps);
        this.renderKeyword(keywords);
        this.renderCoLeanBooks(coLoanBooks);
        this.renderManiaBooks(maniaRecBooks);
        this.renderReaderBooks(readerRecBooks);

        this.loadingElement?.remove();
        this.loadingElement = null;
    }

    renderBook(book: IBook) {
        const {
            bookname,
            bookImageURL,
            ...otherData
            // authors, class_nm,  class_no, description, isbn13,  loanCnt, publication_year,  publisher,
        } = book;

        const bookNames = bookname
            .split(/[=/:]/)
            .map((item) => `<p>${item}</p>`)
            .join("");

        (this.querySelector(".bookname") as HTMLElement).innerHTML = bookNames;

        const bookImageElement = this.querySelector<BookImage>("book-image");
        if (!bookImageElement) return;
        bookImageElement.data = {
            bookImageURL,
            bookname,
        };

        Object.entries(otherData).forEach(([key, value]) => {
            const element = this.querySelector(`.${key}`) as HTMLElement;
            element.textContent = value;
        });
    }

    renderLoanGroups(loanGrps: ILoanGroups[]) {
        const loanGroupBody = this.querySelector(".loanGrps tbody");
        if (!loanGroupBody) return;

        const template = document.querySelector(
            "#tp-loanGrpItem"
        ) as HTMLTemplateElement;
        if (!template) return;

        const fragment = new DocumentFragment();
        loanGrps.forEach((loanGrp) => {
            const clone = cloneTemplate(template);
            Object.entries(loanGrp).map(([key, value]) => {
                const targetElement = clone.querySelector(
                    `.${key}`
                ) as HTMLElement;
                targetElement.textContent = value;
            });
            fragment.appendChild(clone);
        });

        loanGroupBody.appendChild(fragment);
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
        const template = document.querySelector(
            "#tp-coLoanBookItem"
        ) as HTMLTemplateElement;
        if (!template) return;

        const fragment = new DocumentFragment();
        coLoanBooks
            .map((book) => this.createRecItem(template, book))
            .forEach((el) => fragment.appendChild(el));

        this.querySelector(".coLoanBooks")?.appendChild(fragment);
    }

    renderManiaBooks(maniaRecBooks: IMainaBook[]) {
        const template = this.recBookTemplate;
        if (!template) return;

        const fragment = new DocumentFragment();
        maniaRecBooks
            .map((book) => this.createRecItem(template, book))
            .forEach((el) => fragment.appendChild(el));

        this.querySelector(".maniaBooks")?.appendChild(fragment);
    }

    renderReaderBooks(readerRecBooks: IReaderBook[]) {
        const template = this.recBookTemplate;
        if (!template) return;

        const fragment = new DocumentFragment();
        readerRecBooks
            .map((book) => this.createRecItem(template, book))
            .forEach((el) => fragment.appendChild(el));

        this.querySelector(".readerBooks")?.appendChild(fragment);
    }

    createRecItem(template: HTMLTemplateElement, book: IReaderBook) {
        const el = cloneTemplate(template);
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
