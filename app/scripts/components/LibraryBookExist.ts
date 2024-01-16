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
        library: Record<string, string>
    ): Promise<void> {
        const entries = Object.entries(library);
        this.loading(entries.length);
        if (button) button.disabled = true;

        const promises = entries.map(async ([libCode, libName], index) => {
            try {
                const data = await CustomFetch.fetch<IBookExist>(
                    `/book-exist?isbn13=${isbn13}&libCode=${libCode}`
                );
                this.renderBookExist(data, libName, index);
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
        libName: string,
        index: number
    ): void {
        const { hasBook, loanAvailable } = data;

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
        ).textContent = `∙ ${libName} : `;

        (element.querySelector(".hasBook") as HTMLElement).textContent =
            hasBook === "Y" ? "소장" : "미소장";

        (element.querySelector(".loanAvailable") as HTMLElement).textContent =
            loanAvailableText;
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
            <span class="name"></span>
            <span class="hasBook"></span>
            <span class="loanAvailable"></span>
        </li>`;
    }
}
