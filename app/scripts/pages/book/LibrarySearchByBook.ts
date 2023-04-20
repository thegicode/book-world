import { CustomFetch } from "../../utils/index";
import { getState } from "../../modules/model";

export default class LibrarySearchByBook extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const isbn = new URLSearchParams(location.search).get("isbn") as string;
        this.fetchList(isbn);
    }

    protected async fetchList(isbn: string): Promise<void> {
        const favoriteLibraries = getState().regions;
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
            const template = document.querySelector(
                "#tp-librarySearchByBookItem"
            ) as HTMLTemplateElement;
            if (!template) return;

            const cloned = template.content.firstElementChild?.cloneNode(
                true
            ) as HTMLElement;
            const link = cloned.querySelector("a");
            if (!link) return;

            cloned.dataset.code = libCode;
            link.textContent = libName;
            link.href = homepage;

            this.loanAvailable(
                isbn,
                libCode,
                cloned.querySelector("p") as HTMLElement
            );

            fragment.appendChild(cloned);
        });

        listElement.appendChild(fragment);
        container.appendChild(listElement);
    }

    protected async loanAvailable(
        isbn: string,
        libCode: string,
        el: HTMLElement
    ) {
        const isAvailable = await this.fetchLoadnAvailabilty(isbn, libCode);
        const element = el.querySelector(".loanAvailable");
        if (element) {
            element.textContent = isAvailable ? "대출 가능" : "대출 불가";
            if (isAvailable && el.parentElement) {
                el.parentElement.dataset.available = "true";
            }
        }
    }

    protected async fetchLoadnAvailabilty(
        isbn13: string,
        libCode: string
    ): Promise<boolean> {
        const searchParams = new URLSearchParams({
            isbn13,
            libCode,
        });
        const url = `/book-exist?${searchParams}`;

        try {
            const data = await CustomFetch.fetch<IBookExist>(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            return data.loanAvailable === "Y";
        } catch (error) {
            console.error(error);
            throw new Error(`Fail to get book exist.`);
        }
    }
}
