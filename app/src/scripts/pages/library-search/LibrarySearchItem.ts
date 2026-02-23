import { html, render } from "lit";
import bookModel, { BookModelEvent } from "@/model";

export default class LibrarySearchItem extends HTMLElement {
    private _data: ILibraryData;

    static get observedAttributes() {
        return ["selected"];
    }

    constructor(data: ILibraryData) {
        super();
        this._data = data;
    }

    get data() {
        return this._data;
    }

    set data(val: ILibraryData) {
        this._data = val;
        this.requestUpdate();
    }

    get selected() {
        return this.hasAttribute("selected");
    }

    set selected(value: boolean) {
        if (value) {
            this.setAttribute("selected", "");
        } else {
            this.removeAttribute("selected");
        }
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === "selected" && oldValue !== newValue) {
            this.requestUpdate();
        }
    }

    connectedCallback() {
        this.setAttribute("role", "listitem");
        
        // 초기 상태 동기화 (Model -> Attribute)
        if (bookModel.hasLibrary(this.data.libCode)) {
            this.selected = true;
        }

        bookModel.subscribe(BookModelEvent.LibraryUpdate, this.subscribeUpdate);
        this.requestUpdate();
    }

    disconnectedCallback() {
        bookModel.unsubscribe(BookModelEvent.LibraryUpdate, this.subscribeUpdate);
    }

    private subscribeUpdate = (update?: TLibraryUpdateProps) => {
        if (!update) return;
        const { type, payload } = update;

        if (type === "delete" && payload.code === this.data.libCode) {
            this.selected = false; // Sync Model -> Attribute
        } else if (type === "add" && payload.code === this.data.libCode) {
            this.selected = true; // Sync Model -> Attribute
        }
    };

    private requestUpdate() {
        render(this.template(), this);
    }

    private handleCheckboxChange = (e: Event) => {
        const checkbox = e.target as HTMLInputElement;
        const isChecked = checkbox.checked;
        this.selected = isChecked; // Sync UI -> Attribute

        if (isChecked) {
            bookModel.addLibraries(this.data.libCode, this.data);
        } else {
            bookModel.removeLibraries(this.data.libCode);
        }
    };

    private template() {
        const { libCode, libName, address, tel, fax, homepage, closed, operatingTime, BookCount } = this.data;
        const isSelected = this.selected;

        return html`
            <h3 class="libName">
                <a href="/library?libCode=${encodeURIComponent(libCode)}">${libName}</a>
            </h3>
            <ul>
                <li><span>도서관 코드 : </span><span class="libCode">${libCode}</span></li>
                <li><span>주소 : </span><span class="address">${address || "-"}</span></li>
                <li><span>전화번호 : </span><span class="tel">${tel || "-"}</span></li>
                <li><span>팩스 : </span><span class="fax">${fax || "-"}</span></li>
                <li>
                    <span>홈페이지 : </span>
                    ${homepage ? html`
                        <a class="homepage" href="${homepage}" target="_blank" rel="noopener noreferrer">
                            ${homepage}
                        </a>
                    ` : ""}
                </li>
                <li><span>휴관일 : </span><span class="closed">${closed || "-"}</span></li>
                <li><span>운영시간 : </span><span class="operatingTime">${operatingTime || "-"}</span></li>
                <li><span>단행본수 : </span><span class="BookCount">${BookCount || "-"}</span></li>
            </ul>
            <div class="actions">
                <label class="my-library-label">
                    <input 
                        type="checkbox" 
                        name="myLibrary" 
                        .checked="${isSelected}" 
                        @change="${this.handleCheckboxChange}"
                    />
                    <span>관심 도서관</span>
                </label>
            </div>
        `;
    }
}