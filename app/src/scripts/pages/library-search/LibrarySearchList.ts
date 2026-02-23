import LibrarySearchItem from "./LibrarySearchItem";
import { manageFocus } from "@/utils/helpers";

export default class LibrarySearchList extends HTMLElement {
    private listContainer: HTMLElement;
    private notFoundTemplate: HTMLTemplateElement | null = null;

    static get observedAttributes() {
        return ["total"];
    }

    constructor() {
        super();
        this.listContainer = document.createElement("div");
        this.listContainer.className = "library-list";
    }

    get total() {
        return parseInt(this.getAttribute("total") || "0", 10);
    }

    set total(value: number) {
        this.setAttribute("total", String(value));
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === "total" && oldValue !== newValue) {
            // total이 바뀔 때 수행할 UI 업데이트가 있다면 여기 추가 (예: 개수 표시 레이블)
        }
    }

    connectedCallback() {
        this.appendChild(this.listContainer);
        this.notFoundTemplate = document.querySelector("#tp-notFound");
    }

    /**
     * Resets the list and renders new items.
     * @param items Array of library data
     */
    setItems(items: ILibraryData[]) {
        this.clear();
        this.appendItems(items);
        // Focus management is handled here or by the controller. 
        // Since this is a view update, managing focus here makes sense if it's a full reload.
        manageFocus(this, ".library-list");
    }

    /**
     * Appends items to the existing list.
     * @param items Array of library data
     */
    appendItems(items: ILibraryData[]) {
        if (items.length === 0 && this.listContainer.children.length === 0) {
            this.renderNotFound();
            this.total = 0;
            return;
        }

        const fragment = new DocumentFragment();
        items.forEach((item) => {
            const itemElement = new LibrarySearchItem(item);
            fragment.appendChild(itemElement);
        });
        this.listContainer.appendChild(fragment);
    }

    /**
     * Clears the list content.
     */
    clear() {
        this.listContainer.innerHTML = "";
        this.total = 0;
    }

    /**
     * Renders the "Not Found" message.
     */
    renderNotFound() {
        this.clear();
        if (this.notFoundTemplate) {
            this.listContainer.appendChild(this.notFoundTemplate.content.cloneNode(true));
        } else {
            this.listContainer.textContent = "데이터가 없습니다.";
        }
    }

    /**
     * Renders an error message.
     */
    renderError(message = "오류가 발생했습니다.") {
        this.clear();
        const div = document.createElement("div");
        div.className = "error-message"; // Ensure this class has styles if needed, or reuse notFound style
        div.setAttribute("role", "alert");
        div.textContent = message;
        this.listContainer.appendChild(div);
    }
}