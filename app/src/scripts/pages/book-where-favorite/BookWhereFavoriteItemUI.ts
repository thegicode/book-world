import { BookImage } from "@/components";
import bookModel from "@/model";
import BookWhereFavoriteItem from "./BookWhereFavoriteItem";

export default class BookWhereFavoriteItemUI {
    private component: BookWhereFavoriteItem;

    constructor(component: BookWhereFavoriteItem) {
        this.component = component;
    }

    render({
        bookImageURL,
        bookname,
        authors,
        isbn13,
    }: IBook) {
        // Book Cover Image
        const coverLinkEl = this.component.querySelector(
            ".book-cover-link"
        ) as HTMLAnchorElement;
        if (coverLinkEl) {
            coverLinkEl.innerHTML = "";
            coverLinkEl.href = `/book?isbn=${isbn13}`;
            coverLinkEl.appendChild(new BookImage(bookImageURL, bookname));
        }

        // Book Name
        const booknameEl = this.component.querySelector(".bookname") as HTMLElement;
        if (booknameEl) {
            booknameEl.textContent = bookname;
        }

        // Authors
        const authorsEl = this.component.querySelector(".authors") as HTMLElement;
        if (authorsEl) {
            authorsEl.textContent = authors || "저자 정보 없음";
        }

        // Find Library Link (book-where 연계)
        const findLibLink = this.component.querySelector(".find-library-link") as HTMLAnchorElement;
        if (findLibLink) {
            findLibLink.href = `/book-where-library.html?isbn13=${isbn13}`;
        }

        this.evaluateLibraryStatus();
    }

    public updateBadge(text: string, badgeClass: "badge-available" | "badge-check" | "badge-search") {
        const badgeEl = this.component.querySelector(".status-badge") as HTMLButtonElement;
        const badgeText = this.component.querySelector(".badge-text") as HTMLElement;
        if (badgeEl && badgeText) {
            badgeEl.className = `status-badge ${badgeClass}`;
            badgeText.textContent = text;
        }
    }

    public evaluateLibraryStatus() {
        const userLibraries = Object.keys(bookModel.libraries);
        if (userLibraries.length === 0) {
            this.updateBadge("소장 도서관 검색", "badge-search");
        } else {
            this.updateBadge("대출 상태 확인", "badge-check");
        }
    }

    renderError() {
        this.component.dataset.fail = "true";
        const booknameEl = this.component.querySelector(".bookname") as HTMLElement;
        if (booknameEl) {
            booknameEl.textContent = `ISBN : ${this.component.isbn}`;
        }
        const authorsEl = this.component.querySelector(".authors") as HTMLElement;
        if (authorsEl) {
            authorsEl.textContent = "도서 정보를 불러올 수 없습니다.";
        }
    }
}
