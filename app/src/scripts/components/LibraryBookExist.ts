import { CustomFetch } from "../utils/index";

export default class LibraryBookExist extends HTMLElement {
    protected container: Element;
    protected itemTemplate: string;

    constructor() {
        super();
        this.container = this.querySelector(".library-list") as Element;
        this.itemTemplate = "";
    }

    connectedCallback(): void {
        this.itemTemplate = this.template();
    }

    async onLibraryBookExist(
        button: HTMLButtonElement | null,
        isbn13: string,
        library: TLibraries
    ): Promise<void> {
        const entries = Object.entries(library);
        this.loading(entries.length);
        if (button) button.disabled = true;

        const promises = entries.map(async ([libCode, libData], index) => {
            try {
                const data = await CustomFetch.fetch<IBookExist>(
                    `/book-exist?isbn13=${isbn13}&libCode=${libCode}`
                );
                this.renderBookExist(data, libData, index);
            } catch (error) {
                console.error(error);
                throw new Error(`Fail to get usage analysis list.`);
            }
        });

        try {
            await Promise.all(promises);
            this.removeLoading();
        } catch (error) {
            console.error("Failed to fetch data for some libraries");
        }
    }

    protected renderBookExist(
        data: IBookExist,
        libData: ILibraryData,
        index: number
    ): void {
        const { hasBook, loanAvailable } = data;
        // 대출 가능여부는 조회일 기준 전날의 대출 상태를 기준으로 제공
        const { libName, homepage } = libData;

        const loanAvailableText =
            hasBook === "Y"
                ? loanAvailable === "Y"
                    ? "| 대출가능"
                    : "| 대출불가"
                : "";

        const element = this.querySelectorAll(".library-item")[
            index
        ] as HTMLElement;

        (
            element.querySelector(".name") as HTMLElement
        ).textContent = `${libName}`;

        (element.querySelector(".hasBook") as HTMLElement).textContent =
            hasBook === "Y" ? ": 소장" : ": 미소장";

        (element.querySelector(".loanAvailable") as HTMLElement).textContent =
            loanAvailableText;
        (element.querySelector("a") as HTMLAnchorElement).href = homepage;
    }

    protected loading(size: number) {
        let text = "";
        while (size > 0) {
            text += this.itemTemplate;
            size--;
        }
        this.container.innerHTML = text;
    }

    protected removeLoading() {
        (
            this.querySelectorAll(
                ".library-item[data-loading=true]"
            ) as NodeListOf<HTMLElement>
        ).forEach((el) => {
            delete el.dataset.loading;
        });
    }

    protected template() {
        return `<li class="library-item" data-loading="true">
            <a href="" target="_blank"><span class="name"></span></a>
            <span class="hasBook"></span>
            <span class="loanAvailable"></span>
        </li>`;
    }
}
