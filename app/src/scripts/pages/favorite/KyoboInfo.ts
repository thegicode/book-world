import { CustomFetch } from "../../utils";
import { cloneTemplate } from "../../utils/helpers";

export default class KyoboInfo extends HTMLElement {
    private _isbn: string | null = null;
    private listElement: HTMLElement;
    private template: HTMLTemplateElement;

    constructor() {
        super();

        this._isbn = this.getIsbn() || null;
        this.listElement = this.querySelector("ul") as HTMLElement;
        this.template = this.querySelector(
            "#tp-kyoboInfoItem"
        ) as HTMLTemplateElement;
    }

    connectedCallback() {}

    disconnectedCallback() {}

    show() {
        this.fetch();
    }

    private getIsbn() {
        const cloeset = this.closest("[data-isbn]") as HTMLElement;
        if (!cloeset) return;
        return cloeset.dataset.isbn;
    }

    private async fetch() {
        const bookUrl = `/kyobo-book?isbn=${this._isbn}`;
        try {
            // const infoArray = [
            //     {
            //         href: "https://product.kyobobook.co.kr/detail/S000001913217",
            //         prodType: "종이책",
            //         prodPrice: "16,020원",
            //     },
            //     {
            //         href: "https://ebook-product.kyobobook.co.kr/dig/epd/ebook/E000002981270",
            //         prodType: "eBook",
            //         prodPrice: "11,220원",
            //     },
            //     {
            //         href: "https://ebook-product.kyobobook.co.kr/dig/epd/sam/E000002981270?tabType=SAM",
            //         prodType: "sam",
            //         prodPrice: "eBook",
            //     },
            // ];

            const infoArray = (await CustomFetch.fetch(
                bookUrl
            )) as TKyeboInfoProps[];

            this.render(infoArray);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`Error fetching books: ${error.message}`);
            } else {
                console.error("An unexpected error occurred");
            }
        }
    }

    private render(data: TKyeboInfoProps[]) {
        this.listElement.innerHTML = "";
        const fragment = new DocumentFragment();
        data.map(({ href, prodType, prodPrice }: TKyeboInfoProps) => {
            const element = cloneTemplate(this.template);

            const linkElement = element.querySelector("a") as HTMLAnchorElement;
            linkElement.href = href;

            const spanElement = element.querySelector("span") as HTMLElement;
            spanElement.textContent = `・ ${prodType} : ${prodPrice}`;

            return element;
        }).forEach((element: HTMLElement) => fragment.appendChild(element));
        this.listElement.appendChild(fragment);
        this.hidden = false;
    }
}
