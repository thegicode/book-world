import { CustomFetch } from "../../utils/index";
import { cloneTemplate } from "../../utils/helpers";
import store from "../../modules/store";

export default class LibrarySearchByBook extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const isbn = new URLSearchParams(location.search).get("isbn") as string;
        this.fetchList(isbn);
    }

    protected async fetchList(isbn: string): Promise<void> {
        const favoriteLibraries = store.regions;
        if (Object.entries(favoriteLibraries).length === 0) return;

        for (const regionName in favoriteLibraries) {
            const detailCodes = Object.values(favoriteLibraries[regionName]);
            if (detailCodes.length === 0) return;
            const regionCode = detailCodes[0].slice(0, 2);
            detailCodes.forEach((detailCode) => {
                this.fetchLibrarySearchByBook(isbn, regionCode, detailCode);
            });
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
        const url = `/library-search-by-book?${searchParams}`;

        try {
            const data = await CustomFetch.fetch<ILibrarySearchByBookResult>(
                url
            );
            this.render(data, isbn);
        } catch (error) {
            console.error(error);
            throw new Error(`Fail to get library search by book.`);
        }
    }

    protected render(
        { libraries }: ILibrarySearchByBookResult,
        isbn: string
    ): void {
        if (libraries.length < 1) return;

        const container = document.querySelector(".library-search-by-book");
        if (!container) return;

        const listElement = document.createElement("ul");
        const fragment = new DocumentFragment();

        libraries.forEach(({ homepage, libCode, libName }) => {
            const element = this.createLibrarySearchResultItem(
                isbn,
                homepage,
                libCode,
                libName
            ) as HTMLElement;
            if (element) {
                fragment.appendChild(element);
            }
        });

        listElement.appendChild(fragment);
        container.appendChild(listElement);
    }

    protected createLibrarySearchResultItem(
        isbn: string,
        homepage: string,
        libCode: string,
        libName: string
    ) {
        const template = document.querySelector(
            "#tp-librarySearchByBookItem"
        ) as HTMLTemplateElement;
        if (!template) return null;

        const cloned = cloneTemplate(template);

        const link = cloned.querySelector("a");
        if (!link) return null;

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
