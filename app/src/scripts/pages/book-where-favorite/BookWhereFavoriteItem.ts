import template from "../../../markup/templates/book-where-favorite-item.html";
import { CustomFetch } from "@/services/index";
import { LoadingComponent } from "@/components/index";
import bookModel from "@/model";
import BookWhereFavoriteItemUI from "./BookWhereFavoriteItemUI";
import BaseItemComponent from "@/components/BaseItemComponent";

export default class BookWhereFavoriteItem extends BaseItemComponent {
    private loadingComponent: LoadingComponent | null = null;
    private _isbn: string | null = null;
    private ui: BookWhereFavoriteItemUI;

    private bookmarkBtn: HTMLButtonElement | null = null;
    private statusBadgeBtn: HTMLButtonElement | null = null;

    constructor(isbn: string) {
        super(template);
        this._isbn = isbn;
        this.dataset.isbn = isbn;
        this.ui = new BookWhereFavoriteItemUI(this);

        this.onRemoveBookmark = this.onRemoveBookmark.bind(this);
        this.onBadgeClick = this.onBadgeClick.bind(this);
    }

    get isbn() {
        return this._isbn;
    }

    protected onMount() {
        this.loadingComponent = this.querySelector("loading-component");
        this.bookmarkBtn = this.querySelector(".bookmark-btn");
        this.statusBadgeBtn = this.querySelector(".status-badge");

        this.fetchData();

        this.bookmarkBtn?.addEventListener("click", this.onRemoveBookmark);
        this.statusBadgeBtn?.addEventListener("click", this.onBadgeClick);
    }

    disconnectedCallback() {
        this.bookmarkBtn?.removeEventListener("click", this.onRemoveBookmark);
        this.statusBadgeBtn?.removeEventListener("click", this.onBadgeClick);
    }

    protected async fetchData() {
        const url = `/usage-analysis-list?isbn13=${this._isbn}`;
        try {
            const response = await CustomFetch.fetch<IApiResponse<IUsageAnalysisResult>>(url);
            if (response.status === 'success') {
                this.renderUI(response.data.book);
                this.checkLoanAvailability();
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            this.ui.renderError();
            console.error(`${error}, Fail to get usage-analysis-list.`);
        }

        this.loadingComponent?.hide();
    }

    protected renderUI(book: IBook) {
        const { vol, ...renderData } = book;
        this.ui.render(renderData as IBook);
    }

    private async checkLoanAvailability() {
        if (!this._isbn) return;
        const userLibraries = Object.keys(bookModel.libraries);
        if (userLibraries.length === 0) {
            this.ui.updateBadge("소장 도서관 검색", "badge-search");
            return;
        }

        let availableCount = 0;
        let checkedCount = 0;

        for (const libCode of userLibraries) {
            try {
                const res = await CustomFetch.fetch<IApiResponse<IBookExist>>(
                    `/library/book-exist?libCode=${libCode}&isbn13=${this._isbn}`
                );
                if (res.status === "success" && res.data.loanAvailable === "Y") {
                    availableCount++;
                }
                checkedCount++;
            } catch (e) {
                console.error("Error checking book availability:", e);
            }
        }

        if (availableCount > 0) {
            this.ui.updateBadge(`대출 가능 도서관 ${availableCount}곳`, "badge-available");
        } else if (checkedCount > 0) {
            this.ui.updateBadge("대출 상태 확인", "badge-check");
        } else {
            this.ui.updateBadge("소장 도서관 검색", "badge-search");
        }
    }

    private onRemoveBookmark(e: Event) {
        e.preventDefault();
        e.stopPropagation();

        if (!this._isbn) return;

        if (confirm("관심 책 목록에서 삭제하시겠습니까?")) {
            Object.keys(bookModel.favorites).forEach((category) => {
                if (bookModel.hasFavoriteBook(category, this._isbn!)) {
                    bookModel.removeFavoriteBook(category, this._isbn!);
                }
            });
        }
    }

    private onBadgeClick(e: Event) {
        e.preventDefault();
        const findLibLink = this.querySelector(".find-library-link") as HTMLAnchorElement;
        if (findLibLink) {
            findLibLink.click();
        }
    }
}
