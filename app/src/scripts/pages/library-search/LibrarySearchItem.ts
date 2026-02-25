import { LitElement, html, PropertyValues } from "lit";
import bookModel, { BookModelEvent } from "@/model";
import { StoreController } from "@/utils/StoreController";

export default class LibrarySearchItem extends LitElement {
    declare data: ILibraryData;
    declare selected: boolean;

    static properties = {
        data: { type: Object },
        selected: { type: Boolean, reflect: true },
    };

    constructor() {
        super();
        this.selected = false;

        new StoreController<TLibraryUpdateProps>(
            this,
            BookModelEvent.LibraryUpdate,
            (update) => {
                if (!update || !this.data) return;
                const { type, payload } = update;

                if (type === "delete" && payload.code === this.data.libCode) {
                    this.selected = false; // Sync Model -> Attribute
                } else if (
                    type === "add" &&
                    payload.code === this.data.libCode
                ) {
                    this.selected = true; // Sync Model -> Attribute
                }
            },
        );
    }

    createRenderRoot() {
        return this; // Keep light DOM
    }

    connectedCallback() {
        super.connectedCallback();
        this.setAttribute("role", "listitem");
    }

    willUpdate(changedProperties: PropertyValues) {
        if (changedProperties.has("data") && this.data) {
            this.selected = bookModel.hasLibrary(this.data.libCode);
        }
    }

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
                    />
                    <span>관심 도서관</span>
                </label>
            </div>
        `;
    }
}
