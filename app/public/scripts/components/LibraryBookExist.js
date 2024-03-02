var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CustomFetch } from "../utils/index";
export default class LibraryBookExist extends HTMLElement {
    constructor() {
        super();
        this.container = this.querySelector(".library-list");
        this.itemTemplate = "";
    }
    connectedCallback() {
        this.itemTemplate = this.template();
    }
    onLibraryBookExist(button, isbn13, library) {
        return __awaiter(this, void 0, void 0, function* () {
            const entries = Object.entries(library);
            this.loading(entries.length);
            if (button)
                button.disabled = true;
            const promises = entries.map(([libCode, libName], index) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield CustomFetch.fetch(`/book-exist?isbn13=${isbn13}&libCode=${libCode}`);
                    this.renderBookExist(data, libName, index);
                }
                catch (error) {
                    console.error(error);
                    throw new Error(`Fail to get usage analysis list.`);
                }
            }));
            try {
                yield Promise.all(promises);
                this.removeLoading();
            }
            catch (error) {
                console.error("Failed to fetch data for some libraries");
            }
        });
    }
    renderBookExist(data, libName, index) {
        const { hasBook, loanAvailable } = data;
        const loanAvailableText = hasBook === "Y"
            ? loanAvailable === "Y"
                ? "| 대출가능"
                : "| 대출불가"
            : "";
        const element = this.querySelectorAll(".library-item")[index];
        element.querySelector(".name").textContent = `∙ ${libName} : `;
        element.querySelector(".hasBook").textContent =
            hasBook === "Y" ? "소장" : "미소장";
        element.querySelector(".loanAvailable").textContent =
            loanAvailableText;
    }
    loading(size) {
        let text = "";
        while (size > 0) {
            text += this.itemTemplate;
            size--;
        }
        this.container.innerHTML = text;
    }
    removeLoading() {
        this.querySelectorAll(".library-item[data-loading=true]").forEach((el) => {
            delete el.dataset.loading;
        });
    }
    template() {
        return `<li class="library-item" data-loading="true">
            <span class="name"></span>
            <span class="hasBook"></span>
            <span class="loanAvailable"></span>
        </li>`;
    }
}
//# sourceMappingURL=LibraryBookExist.js.map