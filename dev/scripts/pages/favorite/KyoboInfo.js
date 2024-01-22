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
export default class KyoboInfo extends HTMLElement {
    constructor() {
        super();
        this._isbn = null;
        this._isbn = this.getIsbn() || null;
        this.container = this.querySelector("ul");
    }
    connectedCallback() {
        this.fetch();
    }
    disconnectedCallback() {
        //
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
            // const bookUrl = `/kyobo-book?isbn=S000001913217`;
            try {
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
    render(infos) {
        infos
            .map((text) => {
            const element = document.createElement("li");
            element.textContent = text;
            return element;
        })
            .forEach((element) => this.container.appendChild(element));
    }
}
//# sourceMappingURL=KyoboInfo.js.map