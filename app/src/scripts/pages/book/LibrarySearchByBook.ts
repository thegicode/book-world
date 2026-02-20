import { CustomFetch } from "../../services/index";
import { cloneTemplate } from "../../utils/helpers";
import bookModel from "../../model";

export default class LibrarySearchByBook extends HTMLElement {
    protected librarySearchByBookContainer: HTMLElement | null = null;
    protected librarySearchByBookItemTemplate: HTMLTemplateElement | null = null;
    protected feedbackElement: HTMLElement | null = null;

    constructor() {
        super();
    }

    connectedCallback() {
        setTimeout(async () => {
            this.librarySearchByBookContainer = this.querySelector(".library-search-by-book");
            if (!this.librarySearchByBookContainer) {
                console.error("LibrarySearchByBook: Container .library-search-by-book not found");
            }
            
            this.librarySearchByBookItemTemplate = document.querySelector("#tp-librarySearchByBookItem");
            this.feedbackElement = this.querySelector(".library-search-feedback");

            const params = new URLSearchParams(location.search);
            const isbn = params.get("isbn") as string;
            const libCode = params.get("libCode");

            const titleEl = this.querySelector(".title");
            if (titleEl) {
                if (libCode) {
                    titleEl.textContent = "해당 도서관 소장 여부";
                } else {
                    titleEl.textContent = "관심 도서관 소장 정보";
                }
            }

            if (libCode) {
                await this.fetchSpecificLibrary(isbn, libCode);
            } else {
                this.fetch(isbn);
            }
        }, 0);
    }

    protected async fetchSpecificLibrary(isbn: string, libCode: string): Promise<void> {
        try {
            const response = await CustomFetch.fetch<IApiResponse<{
                libName: string;
                homepage: string;
                address: string;
                tel: string;
            }>>(`/api/library-detail?libCode=${libCode}`);
            
            if (response.status === 'success' && response.data) {
                const { libName, homepage, address, tel } = response.data;
                const dummyResult: ILibrarySearchByBookResult = {
                    libraries: [{
                        libCode,
                        libName,
                        homepage,
                        address: address || '',
                        telephone: tel || '',
                    }]
                };
                
                this.render(dummyResult, isbn);
            }
        } catch (error) {
            console.warn(`Failed to fetch specific library ${libCode}`, error);
        }
    }

    protected async fetch(isbn: string): Promise<void> {
        const libraries = Object.values(bookModel.libraries);

        if (libraries.length === 0) {
            if (this.feedbackElement) {
                this.feedbackElement.textContent = "즐겨찾기한 도서관이 없습니다.";
            }
            return;
        }

        const result: ILibrarySearchByBookResult = {
            libraries: libraries
        };

        this.render(result, isbn);
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
        try {
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
        } catch (error) {
            console.warn(`Failed to check availability for ${libCode}`, error);
            // Optionally update UI to show check failed
        }
    }

    protected async fetchLoadnAvailabilty(isbn13: string, libCode: string) {
        const searchParams = new URLSearchParams({
            isbn13,
            libCode,
        });
        const url = `/book-exist?${searchParams}`;
        try {
            const result = await CustomFetch.fetchData<IBookExist>(url);
            return result;
        } catch (error) {
            console.error(error);
            throw new Error(`Fail to get book exist.`);
        }
    }
}
