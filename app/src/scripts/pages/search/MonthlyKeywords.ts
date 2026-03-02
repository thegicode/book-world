import { CustomFetch } from "@/services";
import { showToast } from "@/utils/toast";
import searchStore from "@/model/SearchStore";
import { searchForm, searchInputElement } from "./selectors";

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
            const response = await CustomFetch.fetch<IApiResponse<IMonthlyKeywordsBookResponse>>(
                `/monthly-keywords?${searchParams}`
            );
            this.render(response.data.keywords);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '월간 키워드를 불러오는 중 오류가 발생했습니다.';
            showToast(errorMessage);
            console.error(error);
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
        searchStore.searchBooks(word, sort);
    }
}

