import { LitElement, html, nothing } from "lit";
import { repeat } from "lit/directives/repeat.js";
import bookModel, { BookModelEvent } from "@/model";
import { StoreController } from "@/utils/StoreController";

export default class LibrarySearchStored extends LitElement {
    // items will be derived from bookModel, so we don't strictly need a property for it unless we want to pass it down.
    // However, to trigger updates, we can use a private property or just requestUpdate.
    
    constructor() {
        super();
        new StoreController(this, bookModel.getPublisher(BookModelEvent.LibraryUpdate));
    }

    createRenderRoot() {
        return this;
    }

    private handleRemove(code: string) {
        bookModel.removeLibraries(code);
    }

    render() {
        const libraries = bookModel.libraries;
        const libraryOrder = bookModel.libraryOrder;

        if (libraryOrder.length === 0) {
            return html`
                <h2 class="title">저장된 관심 도서관</h2>
                <p class="empty-message">저장된 도서관이 없습니다.</p>
            `;
        }

        return html`
            <h2 class="title">저장된 관심 도서관</h2>
            <ul class="libries">
                ${repeat(
                    libraryOrder,
                    (code) => code,
                    (code) => {
                        const data = libraries[code];
                        if (!data) return nothing; // 데이터가 없는 경우 건너뜀

                        const libName = typeof data === "string" ? data : data.libName;
                        return html`
                            <li data-library="${code}">
                                <a href="/library?libCode=${encodeURIComponent(code)}" class="name">
                                    ${libName}
                                </a>
                                <button 
                                    type="button" 
                                    class="cancelButton" 
                                    aria-label="${libName} 관심 도서관 해제"
                                    @click="${() => this.handleRemove(code)}"
                                >
                                    해제
                                </button>
                            </li>
                        `;
                    }
                )}
            </ul>
        `;
    }
}
