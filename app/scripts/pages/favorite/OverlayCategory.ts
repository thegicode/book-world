import bookStore from "../../modules/BookStore";
import { cloneTemplate } from "../../utils/helpers";

export default class OverlayCategory extends HTMLElement {
    form: HTMLFormElement | null;
    list: HTMLElement | null;
    template: HTMLTemplateElement | null;
    renameButton: HTMLButtonElement | null;
    addButton: HTMLButtonElement | null;
    addInput: HTMLInputElement | null;
    closeButton: HTMLButtonElement | null;
    draggedItem: HTMLLIElement | null = null;

    static get observedAttributes() {
        return ["hidden"];
    }

    constructor() {
        super();

        this.form = this.querySelector("form");
        this.list = this.querySelector(".category-list");
        this.template = document.querySelector("#tp-category-item");
        this.renameButton = this.querySelector(".rename");
        this.addButton = this.querySelector(".addButton");
        this.addInput = this.querySelector("input[name='add']");
        this.closeButton = this.querySelector(".closeButton");
        this.draggedItem = null;

        this.handleRename = this.handleRename.bind(this);
    }

    connectedCallback() {
        this.render();

        this.addButton?.addEventListener("click", this.handleClickAdd);
        this.form?.addEventListener("submit", this.handleSubmit);
        this.closeButton?.addEventListener("click", this.handleClose);
    }

    disconnectedCallback() {
        this.addButton?.removeEventListener("click", this.handleClickAdd);
        this.form?.removeEventListener("submit", this.handleSubmit);
        this.closeButton?.removeEventListener("click", this.handleClose);
    }

    attributeChangedCallback(name: string) {
        if (name === "hidden" && !this.hasAttribute("hidden")) {
            this.initial();
        }
    }

    private initial() {
        if (this.list) {
            this.list.innerHTML = "";
            this.render();
        }
    }

    private render() {
        if (!this.list) return;

        const fragment = new DocumentFragment();
        bookStore.categorySort.forEach((category, index) => {
            const cloned = this.createItem(category, index);
            fragment.appendChild(cloned);
        });

        this.list.appendChild(fragment);
    }

    private createItem(category: string, index: number) {
        if (this.template === null) {
            throw new Error("Template is null");
        }

        const cloned = cloneTemplate<HTMLLIElement>(this.template);

        cloned.dataset.index = index.toString();
        cloned.dataset.category = category;

        const input = cloned.querySelector(
            "input[name='category']"
        ) as HTMLInputElement;
        if (input) {
            input.value = category;
        }

        this.handleItemEvent(cloned, input, category);

        this.changeItem(cloned);

        return cloned;
    }

    private handleItemEvent(
        cloned: HTMLLIElement,
        input: HTMLInputElement,
        category: string
    ) {
        cloned
            .querySelector(".renameButton")
            ?.addEventListener("click", () =>
                this.handleRename(input, category)
            );

        cloned
            .querySelector(".deleteButton")
            ?.addEventListener("click", () =>
                this.handleDelete(cloned, category)
            );

        cloned.addEventListener("keydown", (event: KeyboardEvent) => {
            const input = event.target as HTMLInputElement;
            if (event.key === "Enter" && input.name === "category") {
                this.handleRename(input, category);
            }
        });
    }

    private handleRename(input: HTMLInputElement, category: string) {
        const value = input.value;
        if (!value || category === value) return;

        bookStore.renameCategory(category, value);
    }

    private handleDelete(cloned: HTMLLIElement, category: string) {
        cloned.remove();
        bookStore.deleteCategory(category);
    }

    private changeItem(cloned: HTMLLIElement) {
        const dragggerButton = cloned.querySelector(
            ".dragger"
        ) as HTMLButtonElement;
        dragggerButton.addEventListener("mousedown", () => {
            cloned.draggable = true;
        });
        dragggerButton.addEventListener("mouseup", () => {
            cloned.removeAttribute("draggable");
        });

        cloned.addEventListener("dragstart", () => {
            this.draggedItem = cloned as HTMLLIElement;
            cloned.draggable = true;
        });

        cloned.addEventListener("dragend", () => {
            if (this.draggedItem === cloned) {
                this.draggedItem = null;
                cloned.removeAttribute("draggable");
            }
        });

        cloned.addEventListener("dragover", (event: DragEvent) => {
            event.preventDefault();
        });

        cloned.addEventListener("dragenter", () => {
            if (this.draggedItem === cloned) return;
            cloned.dataset.drag = "dragenter";
        });

        // cloned.addEventListener("dragleave", () => {
        //     if (this.draggedItem === cloned) return;
        // });

        cloned.addEventListener("drop", () => {
            if (!this.draggedItem || !this.list) return;

            this.list.insertBefore(this.draggedItem, cloned);
            const draggedKey = this.draggedItem.dataset.category;
            const targetKey = cloned.dataset.category;
            if (draggedKey && targetKey) {
                bookStore.changeCategory(draggedKey, targetKey);
            }
            delete cloned.dataset.drag;
        });
    }

    private handleClickAdd = () => {
        if (!this.addInput) return;

        const category = this.addInput.value;
        if (!category) return;

        if (bookStore.hasCategory(category)) {
            alert("중복된 이름입니다.");
            this.addInput.value = "";
            return;
        }

        bookStore.addCategory(category);
        bookStore.addCategorySort(category);

        const index = bookStore.categorySort.length;
        const cloned = this.createItem(category, index);
        this.list?.appendChild(cloned);

        this.addInput.value = "";
    };

    private handleSubmit = (event: Event) => {
        event.preventDefault();
        this.handleClickAdd();
    };

    private handleClose = () => {
        this.hidden = true;
    };
}
