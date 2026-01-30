import { BookImage } from "../../components/index";
import { CustomFetch } from "../../utils/index";
import { cloneTemplate, fillElementsWithData } from "../../utils/helpers";

export default class Book extends HTMLElement {
    protected loadingElement: HTMLElement | null;
    protected data: IUsageAnalysisListData | null;
    protected booknameElement: HTMLElement | null = null;
    protected descriptionElement: HTMLElement | null = null;
    protected bookImageContainer: HTMLElement | null = null;
    protected loanHistoryTbody: HTMLElement | null = null;
    protected loanGrpsTbody: HTMLElement | null = null;
    protected keywordElement: HTMLElement | null = null;
    protected loanHistoryItemTemplate: HTMLTemplateElement | null = null;
    protected loanGrpItemTemplate: HTMLTemplateElement | null = null;

    constructor() {
        super();
        this.loadingElement = null;
        this.data = null;
    }

    connectedCallback() {
        this.loadingElement = this.querySelector(".loading") as HTMLElement;

        const isbn = new URLSearchParams(location.search).get("isbn") as string;
        this.dataset.isbn = isbn;

        this.booknameElement = this.querySelector(".bookname");
        this.descriptionElement = this.querySelector(".description");
        this.bookImageContainer = this.querySelector(".book-image-container");
        this.loanHistoryTbody = this.querySelector(".loanHistory tbody");
        this.loanGrpsTbody = this.querySelector(".loanGrps tbody");
        this.keywordElement = this.querySelector(".keyword");
        this.loanHistoryItemTemplate = this.querySelector("#tp-loanHistoryItem");
        this.loanGrpItemTemplate = document.querySelector("#tp-loanGrpItem");


        this.fetchUsageAnalysisList(isbn).then(() => {
            this.render();
        });
    }

    protected async fetchUsageAnalysisList(isbn: string): Promise<void> {
        try {
            this.data = await CustomFetch.fetchData<IUsageAnalysisListData>(
                `/usage-analysis-list?isbn13=${isbn}`
            );
        } catch (error) {
            this.renderError();
            console.error(error);
            throw new Error(`Fail to get usage analysis list.`);
        }
    }

    protected render() {
        if (!this.data || !this.data.book) {
            console.error(
                "Failed to render book component: 'book' data is missing from the API response.",
                this.data,
            );
            this.renderError();
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
            addition_symbol,
            ...otherData
            // authors, class_nm,  class_no, description, isbn13,  loanCnt, publication_year,  publisher,
        } = book;

        // console.log(addition_symbol);

        const bookNames = bookname
            .split(/[=/:]/)
            .map((item) => `<p>${item}</p>`)
            .join("");

        if (this.booknameElement) this.booknameElement.innerHTML = bookNames;
        if (this.descriptionElement) this.descriptionElement.innerHTML = description;

        // const bookImageElement = this.querySelector<BookImage>("book-image");
        // if (!bookImageElement) return;
        // bookImageElement.data = {
        //     bookImageURL,
        //     bookname,
        // };

        const bookImage = new BookImage(bookImageURL, bookname);
        if (this.bookImageContainer) this.bookImageContainer.appendChild(bookImage);

        fillElementsWithData(otherData, this);
    }

    renderLoanHistory(loanHistory: ILoanHistory[]) {
        const fragment = new DocumentFragment();
        loanHistory.forEach((history) => {
            const cloned = cloneTemplate(
                this.loanHistoryItemTemplate as HTMLTemplateElement,
            );
            fillElementsWithData(history, cloned);

            fragment.appendChild(cloned);
        });

        if (this.loanHistoryTbody) this.loanHistoryTbody.appendChild(fragment);
    }

    renderLoanGroups(loanGrps: ILoanGroups[]) {
        const template = this.loanGrpItemTemplate;
        if (!template) return;

        const fragment = new DocumentFragment();
        loanGrps.forEach((loanGrp) => {
            const clone = cloneTemplate(template);

            fillElementsWithData(loanGrp, clone);

            fragment.appendChild(clone);
        });

        if (this.loanGrpsTbody) this.loanGrpsTbody.appendChild(fragment);
    }

    renderKeyword(keywords: IKeyword[]) {
        const keywordsString = keywords
            .map((item) => {
                const url = encodeURI(item.word);
                return `<a href="/search?keyword=${url}"><span>${item.word}</span></a>`;
            })
            .join("");

        if (this.keywordElement) this.keywordElement.innerHTML = keywordsString;
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
