import { LitElement, html } from "lit";
import bookModel, { BookModelEvent } from "@/model";
import { StoreController } from "@/utils/StoreController";

export default class LibrarySearchItem extends LitElement {
    declare data: ILibraryData;

    static properties = {
        data: { type: Object },
    };

    constructor() {
        super();
        new StoreController(this, bookModel.getPublisher(BookModelEvent.LibraryUpdate));
    }

    private get selected() {
        return this.data ? bookModel.hasLibrary(this.data.libCode) : false;
    }

    createRenderRoot() {
        return this; // Keep light DOM
    }

    connectedCallback() {
        super.connectedCallback();
        this.setAttribute("role", "listitem");
    }

    private handleChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target.checked) {
            bookModel.addLibrary(this.data.libCode, this.data);
        } else {
            bookModel.removeLibrary(this.data.libCode);
        }
    };

    render() {
        if (!this.data) return html``;

        const {
            libCode,
            libName,
            address,
            tel,
            fax,
            homepage,
            closed,
            operatingTime,
            BookCount,
        } = this.data;
        const isSelected = this.selected;

        return html`
            <h3 class="libName">
                <a href="/library?libCode=${encodeURIComponent(libCode)}"
                    >${libName}</a
                >
            </h3>
            <ul>
                <li>
                    <span>도서관 코드 : </span
                    ><span class="libCode">${libCode}</span>
                </li>
                <li>
                    <span>주소 : </span
                    ><span class="address">${address || "-"}</span>
                </li>
                <li>
                    <span>전화번호 : </span
                    ><span class="tel">${tel || "-"}</span>
                </li>
                <li>
                    <span>팩스 : </span><span class="fax">${fax || "-"}</span>
                </li>
                <li>
                    <span>홈페이지 : </span>
                    ${homepage
                        ? html`
                              <a
                                  class="homepage"
                                  href="${homepage}"
                                  target="_blank"
                                  rel="noopener noreferrer"
                              >
                                  ${homepage}
                              </a>
                          `
                        : ""}
                </li>
                <li>
                    <span>휴관일 : </span
                    ><span class="closed">${closed || "-"}</span>
                </li>
                <li>
                    <span>운영시간 : </span
                    ><span class="operatingTime">${operatingTime || "-"}</span>
                </li>
                <li>
                    <span>단행본수 : </span
                    ><span class="BookCount">${BookCount || "-"}</span>
                </li>
            </ul>
            <div class="actions">
                <label class="my-library-label">
                    <input
                        type="checkbox"
                        name="myLibrary"
                        .checked="${isSelected}"
                        @change="${this.handleChange}"
                    />
                    <span>관심 도서관</span>
                </label>
            </div>
        `;
    }
}

