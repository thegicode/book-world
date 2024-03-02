import { BookImage } from "../../components/index";
import { CustomFetch } from "../../utils/index";
import { cloneTemplate, fillElementsWithData } from "../../utils/helpers";

export default class Book extends HTMLElement {
    protected loadingElement: HTMLElement | null;
    protected data: IUsageAnalysisListData | null;

    constructor() {
        super();
        this.loadingElement = null;
        this.data = null;
    }

    connectedCallback() {
        this.loadingElement = this.querySelector(".loading") as HTMLElement;

        const isbn = new URLSearchParams(location.search).get("isbn") as string;
        this.dataset.isbn = isbn;

        this.fetchUsageAnalysisList(isbn).then(() => {
            this.render();
        });
    }

    protected async fetchUsageAnalysisList(isbn: string): Promise<void> {
        try {
            const data = await CustomFetch.fetch<IUsageAnalysisListData>(
                `/usage-analysis-list?isbn13=${isbn}`
            );
            this.data = data;
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
            loanHistory,
            loanGrps,
            maniaRecBooks,
            readerRecBooks,
        } = this.data;

        this.renderBook(book);
        this.renderLoanHistory(loanHistory);
        this.renderLoanGroups(loanGrps);
        this.renderKeyword(keywords);

        this.renderRecBooks(".coLoanBooks", coLoanBooks, "#tp-coLoanBookItem");
        this.renderRecBooks(".maniaBooks", maniaRecBooks, "#tp-recBookItem");
        this.renderRecBooks(".readerBooks", readerRecBooks, "#tp-recBookItem");

        this.loadingElement?.remove();
        this.loadingElement = null;
    }

    renderBook(book: IBook) {
        const {
            bookname,
            bookImageURL,
            description,
            ...otherData
            // authors, class_nm,  class_no, description, isbn13,  loanCnt, publication_year,  publisher,
        } = book;

        const bookNames = bookname
            .split(/[=/:]/)
            .map((item) => `<p>${item}</p>`)
            .join("");

        (this.querySelector(".bookname") as HTMLElement).innerHTML = bookNames;
        (this.querySelector(".description") as HTMLElement).innerHTML =
            description;

        // const bookImageElement = this.querySelector<BookImage>("book-image");
        // if (!bookImageElement) return;
        // bookImageElement.data = {
        //     bookImageURL,
        //     bookname,
        // };

        const bookImage = new BookImage(bookImageURL, bookname);
        const bookImageContainer = this.querySelector(
            ".book-image-container"
        ) as HTMLElement;
        bookImageContainer.appendChild(bookImage);

        fillElementsWithData(otherData, this);
    }

    renderLoanHistory(loanHistory: ILoanHistory[]) {
        const fragment = new DocumentFragment();
        loanHistory.forEach((history) => {
            const cloned = cloneTemplate(
                this.querySelector("#tp-loanHistoryItem") as HTMLTemplateElement
            );
            fillElementsWithData(history, cloned);

            fragment.appendChild(cloned);
        });

        (this.querySelector(".loanHistory tbody") as HTMLElement).appendChild(
            fragment
        );
    }

    renderLoanGroups(loanGrps: ILoanGroups[]) {
        const template = document.querySelector(
            "#tp-loanGrpItem"
        ) as HTMLTemplateElement;
        if (!template) return;

        const fragment = new DocumentFragment();
        loanGrps.forEach((loanGrp) => {
            const clone = cloneTemplate(template);

            fillElementsWithData(loanGrp, clone);

            fragment.appendChild(clone);
        });

        (this.querySelector(".loanGrps tbody") as HTMLElement).appendChild(
            fragment
        );
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

    renderRecBooks(selector: string, books: IRecBook[], template: string) {
        const container = this.querySelector(selector);
        const tmpl = document.querySelector(template) as HTMLTemplateElement;
        if (!container || !tmpl) {
            console.error("Container or template not found");
            return;
        }

        const fragment = document.createDocumentFragment();

        books
            .map((book) => this.createRecItem(tmpl, book))
            .forEach((item) => fragment.appendChild(item));

        container.appendChild(fragment);
    }

    createRecItem(template: HTMLTemplateElement, book: IRecBook) {
        const element = cloneTemplate(template);
        const { isbn13 } = book;

        fillElementsWithData(book, element);

        const link = element.querySelector("a");
        if (link) link.href = `book?isbn=${isbn13}`;

        return element;
    }

    protected renderError() {
        if (this.loadingElement)
            this.loadingElement.textContent = "정보를 가져올 수 없습니다.";
    }
}
