import { LitElement, html } from "lit";

export default class LibrarySearchForm extends LitElement {
    static properties = {
        keyword: { type: String },
    };

    declare keyword: string;

    constructor() {
        super();
        this.keyword = "";
    }

    createRenderRoot() {
        return this; // 전역 CSS 사용을 위해 Light DOM 유지
    }

    private handleSearch = (e: Event) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const keyword = formData.get("keyword") as string;

        // 검색 실행 요청 (Custom Event)
        this.dispatchEvent(
            new CustomEvent("search", {
                detail: { keyword },
                bubbles: true,
                composed: true,
            }),
        );
    };

    private handleInput = (e: Event) => {
        const input = e.target as HTMLInputElement;
        const keyword = input.value;

        // 실시간 검색어 변경 알림 (Custom Event)
        this.dispatchEvent(
            new CustomEvent("input-change", {
                detail: { keyword },
                bubbles: true,
                composed: true,
            }),
        );
    };

    render() {
        return html`
            <form
                class="search-form"
                role="search"
                @submit="${this.handleSearch}"
            >
                <label for="library-keyword" class="visually-hidden"
                    >도서관 이름</label
                >
                <input
                    type="text"
                    id="library-keyword"
                    name="keyword"
                    placeholder="도서관 이름을 입력하세요"
                    required
                    .value="${this.keyword}"
                    @input="${this.handleInput}"
                />
                <button type="submit">검색</button>
            </form>
        `;
    }
}
