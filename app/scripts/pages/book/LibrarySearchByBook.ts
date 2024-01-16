import { CustomFetch } from "../../utils/index";
import { cloneTemplate } from "../../utils/helpers";
import bookModel from "../../model";

export default class LibrarySearchByBook extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.fetch(new URLSearchParams(location.search).get("isbn") as string);
    }

    protected async fetch(isbn: string): Promise<void> {
        const libries = Object.values(bookModel.regions);
        if (libries.length === 0) return;

        const promises: Promise<void>[] = [];

        libries.forEach((region) => {
            Object.values(region).forEach((detailCode) => {
                promises.push(
                    this.fetchLibrarySearchByBook(
                        isbn,
                        detailCode.slice(0, 2),
                        detailCode
                    )
                );
            });
        });

        await Promise.all(promises);
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
            const data = await CustomFetch.fetch<ILibrarySearchByBookResult>(
                `/library-search-by-book?${searchParams}`
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

        (
            document.querySelector(".library-search-by-book") as HTMLElement
        ).appendChild(listElement);
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
