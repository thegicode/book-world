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
import { bookList, searchForm, searchInputElement } from "./selectors";
export default class MonthlyKeywords extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.fetch();
    }
    // disconnectedCallback() {}
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            date.setMonth(date.getMonth() - 1);
            const month = date.getMonth() + 1;
            const formatMonth = month < 10 ? `0${month}` : month.toString();
            const searchParams = new URLSearchParams({
                month: `${date.getFullYear()}-${formatMonth}`,
            });
            try {
                const data = yield CustomFetch.fetch(`/monthly-keywords?${searchParams}`);
                this.render(data.keywords);
            }
            catch (error) {
                console.error(error);
                throw new Error(`Fail to get monthly keyword.`);
            }
        });
    }
    render(keywords) {
        const fragment = new DocumentFragment();
        keywords
            .map((keyword) => {
            const element = document.createElement("a");
            element.textContent = keyword.word;
            element.href = `?keyword=${keyword.word}`;
            element.addEventListener("click", (event) => this.onKeywordClick(event, keyword.word));
            return element;
        })
            .forEach((element) => fragment.appendChild(element));
        this.appendChild(fragment);
    }
    onKeywordClick(event, word) {
        event.preventDefault();
        const url = new URL(window.location.href);
        const sort = searchForm === null || searchForm === void 0 ? void 0 : searchForm.sort.value;
        url.searchParams.set("keyword", word);
        url.searchParams.set("sort", sort);
        window.history.pushState({}, "", url.toString());
        searchInputElement.value = word;
        bookList === null || bookList === void 0 ? void 0 : bookList.initializeSearchPage(word, sort);
    }
}
//# sourceMappingURL=MonthlyKeywords.js.map