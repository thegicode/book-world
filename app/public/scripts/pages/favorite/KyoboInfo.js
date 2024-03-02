var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CustomFetch } from "../../utils";
import { cloneTemplate } from "../../utils/helpers";
export default class KyoboInfo extends HTMLElement {
    constructor() {
        super();
        this._isbn = null;
        this._isbn = this.getIsbn() || null;
        this.listElement = this.querySelector("ul");
        this.template = this.querySelector("#tp-kyoboInfoItem");
    }
    connectedCallback() { }
    disconnectedCallback() { }
    show() {
        this.fetch();
    }
    getIsbn() {
        const cloeset = this.closest("[data-isbn]");
        if (!cloeset)
            return;
        return cloeset.dataset.isbn;
    }
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
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
                const infoArray = (yield CustomFetch.fetch(bookUrl));
                this.render(infoArray);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(`Error fetching books: ${error.message}`);
                }
                else {
                    console.error("An unexpected error occurred");
                }
            }
        });
    }
    render(data) {
        this.listElement.innerHTML = "";
        const fragment = new DocumentFragment();
        data.map(({ href, prodType, prodPrice }) => {
            const element = cloneTemplate(this.template);
            const linkElement = element.querySelector("a");
            linkElement.href = href;
            const spanElement = element.querySelector("span");
            spanElement.textContent = `・ ${prodType} : ${prodPrice}`;
            return element;
        }).forEach((element) => fragment.appendChild(element));
        this.listElement.appendChild(fragment);
        this.hidden = false;
    }
}
//# sourceMappingURL=KyoboInfo.js.map