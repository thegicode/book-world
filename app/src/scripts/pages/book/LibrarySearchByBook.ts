import { CustomFetch } from "../../services/index";
import { cloneTemplate } from "../../utils/helpers";
import bookModel from "../../model";

export default class LibrarySearchByBook extends HTMLElement {
    protected librarySearchByBookContainer: HTMLElement | null = null;
    protected librarySearchByBookItemTemplate: HTMLTemplateElement | null = null;
    protected feedbackElement: HTMLElement | null = null;
    
    private totalRequestCount = 0;
    private processedRequestCount = 0;
    private failedRequestCount = 0;

    constructor() {
        super();
    }

    connectedCallback() {
        this.fetch(new URLSearchParams(location.search).get("isbn") as string);

        this.librarySearchByBookContainer = document.querySelector(".library-search-by-book");
        this.librarySearchByBookItemTemplate = document.querySelector("#tp-librarySearchByBookItem");
        this.feedbackElement = this.querySelector(".library-search-feedback");
    }

    protected async fetch(isbn: string): Promise<void> {
        const regions = Object.values(bookModel.regions);
        if (regions.length === 0) return;

        const allDetailCodes = regions.flatMap((region) =>
            Object.values(region)
        );

        if (allDetailCodes.length === 0) return;

        this.totalRequestCount = allDetailCodes.length;
        const BATCH_SIZE = 5;

        for (let i = 0; i < allDetailCodes.length; i += BATCH_SIZE) {
            const batch = allDetailCodes.slice(i, i + BATCH_SIZE);
            const promises = batch.map((detailCode) =>
                this.fetchLibrarySearchByBook(
                    isbn,
                    detailCode.slice(0, 2),
                    detailCode
                )
            );
            await Promise.all(promises);
        }
    }

    protected async fetchLibrarySearchByBook(
        isbn: string,
        region: string,
        dtl_region: string
    ): Promise<void> {
        const searchParams = new URLSearchParams({
            isbn,
            region,
            dtl_region,
        });

        try {
            const data =
                await CustomFetch.fetchData<ILibrarySearchByBookResult>(
                    `/library-search-by-book?${searchParams}`
                );
            this.render(data, isbn);
        } catch (error) {
            this.failedRequestCount++;
            console.warn(
                `API call for region ${dtl_region} failed:`,
                error
            );
        } finally {
            this.processedRequestCount++;
            this.updateFeedback();
        }
    }

    protected updateFeedback(): void {
        if (this.processedRequestCount < this.totalRequestCount) {
            return;
        }

        if (this.failedRequestCount > 0 && this.feedbackElement) {
            this.feedbackElement.textContent = `${this.failedRequestCount}개 지역의 도서관 정보를 불러오는 데 실패했습니다.`;
        }
    }

    protected render(
        { libraries }: ILibrarySearchByBookResult,
        isbn: string
    ): void {
        if (libraries.length < 1) return;

        const listElement = document.createElement("ul");
        const fragment = new DocumentFragment();

        libraries
            .map(
                ({ homepage, libCode, libName }) =>
                    this.createLibrarySearchResultItem(
                        isbn,
                        homepage,
                        libCode,
                        libName
                    ) as HTMLElement
            )
            .forEach((element) => fragment.appendChild(element));

        listElement.appendChild(fragment);

        if (this.librarySearchByBookContainer) {
            this.librarySearchByBookContainer.appendChild(listElement);
        }
    }

    protected createLibrarySearchResultItem(
        isbn: string,
        homepage: string,
        libCode: string,
        libName: string
    ) {
        const template = this.librarySearchByBookItemTemplate;
        if (!template) return null;

        const cloned = cloneTemplate(template);
        const link = cloned.querySelector("a") as HTMLAnchorElement;
        cloned.dataset.code = libCode;
        link.textContent = libName;
        link.href = homepage;

        this.loanAvailable(isbn, libCode, cloned);

        return cloned;
    }

    protected async loanAvailable(
        isbn: string,
        libCode: string,
        el: HTMLElement
    ) {
        const { hasBook, loanAvailable } = await this.fetchLoadnAvailabilty(
            isbn,
            libCode
        );
        const hasBookEl = el.querySelector(".hasBook");
        const isAvailableEl = el.querySelector(".loanAvailable");
        if (hasBookEl) {
            hasBookEl.textContent = hasBook === "Y" ? "소장" : "미소장";
        }
        if (isAvailableEl) {
            const isLoanAvailable = loanAvailable === "Y";
            isAvailableEl.textContent = isLoanAvailable
                ? "대출 가능"
                : "대출 불가";
            if (isLoanAvailable) {
                el.dataset.available = "true";
            }
        }
    }

    protected async fetchLoadnAvailabilty(isbn13: string, libCode: string) {
        const searchParams = new URLSearchParams({
            isbn13,
            libCode,
        });
        const url = `/book-exist?${searchParams}`;
        try {
            const result = await CustomFetch.fetch<IBookExist>(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            return result;
        } catch (error) {
            console.error(error);
            throw new Error(`Fail to get book exist.`);
        }
    }
}
