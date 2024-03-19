import { CustomFetch } from "../../utils";
import { searchResult, searchForm, searchInputElement } from "./selectors";

export default class MonthlyKeywords extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.fetch();
    }

    // disconnectedCallback() {}

    private async fetch(): Promise<void> {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        const month = date.getMonth() + 1;
        const formatMonth = month < 10 ? `0${month}` : month.toString();
        const searchParams = new URLSearchParams({
            month: `${date.getFullYear()}-${formatMonth}`,
        });

        try {
            const data = await CustomFetch.fetch<IMonthlyKeywordsBookResponse>(
                `/monthly-keywords?${searchParams}`
            );
            this.render(data.keywords);
        } catch (error) {
            console.error(error);
            throw new Error(`Fail to get monthly keyword.`);
        }
    }

    private render(keywords: TMonthlyKeyword[]) {
        const fragment = new DocumentFragment();
        keywords
            .map((keyword) => {
                const element = document.createElement(
                    "a"
                ) as HTMLAnchorElement;
                element.textContent = keyword.word;
                element.href = `?keyword=${keyword.word}`;
                element.addEventListener("click", (event) =>
                    this.onKeywordClick(event, keyword.word)
                );
                return element;
            })
            .forEach((element) => fragment.appendChild(element));
        this.appendChild(fragment);
    }

    private onKeywordClick(event: MouseEvent, word: string) {
        event.preventDefault();

        const url = new URL(window.location.href);
        const sort = searchForm?.sort.value;

        url.searchParams.set("keyword", word);
        url.searchParams.set("sort", sort);
        window.history.pushState({}, "", url.toString());

        searchInputElement.value = word;
        searchResult?.initializeSearchPage(word, sort);
    }
}
