import { LitElement, html, PropertyValues } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { manageFocus } from "@/utils/helpers";
import "./LibrarySearchItem";

export default class LibrarySearchList extends LitElement {
    declare items: ILibraryData[];
    declare total: number;
    declare error: string | null;
    declare hasSearched: boolean;

    static properties = {
        items: { type: Array },
        total: { type: Number },
        error: { type: String },
        hasSearched: { type: Boolean },
    };

    constructor() {
        super();
        this.items = [];
        this.total = 0;
        this.error = null;
        this.hasSearched = false;
    }

    createRenderRoot() {
        return this;
    }

    // items가 변경된 후 포커스 관리
    updated(changedProperties: PropertyValues) {
        if (changedProperties.has("items")) {
            manageFocus(this, "library-search-item");
        }
    }

    render() {
        return html`
            <div class="library-list" role="list">
                ${this.error
                    ? html`<div class="error-message" role="alert">
                          ${this.error}
                      </div>`
                    : this.hasSearched && this.items.length === 0 && this.total === 0
                      ? html`<div class="no-data">데이터가 없습니다.</div>`
                      : repeat(
                            this.items,

                            (item) => item.libCode,

                            (item) => html`
                                <library-search-item
                                    .data=${item}
                                ></library-search-item>
                            `,
                        )}
            </div>
        `;
    }
}
