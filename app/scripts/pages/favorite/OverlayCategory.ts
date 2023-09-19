import {
    state,
    addCategory,
    hasCategory,
    renameCategory,
    deleteCategory,
    changeCategory,
} from "../../modules/model";
import { CustomEventEmitter } from "../../utils";

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
        state.categorySort.forEach((category, index) => {
            const cloned = this.createItem(category, index);
            fragment.appendChild(cloned);
        });

        this.list.appendChild(fragment);
    }

    private createItem(category: string, index: number) {
        const cloned = this.template?.content.firstElementChild?.cloneNode(
            true
        ) as HTMLLIElement;

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

        renameCategory(category, value);

        CustomEventEmitter.dispatch("categoryRenamed", {
            category,
            value,
        });
    }

    private handleDelete(cloned: HTMLLIElement, category: string) {
        const index = state.categorySort.indexOf(category);

        cloned.remove();
        deleteCategory(category);

        CustomEventEmitter.dispatch("categoryDeleted", {
            index,
        });
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
                changeCategory(draggedKey, targetKey);

                CustomEventEmitter.dispatch("categoryChanged", {
                    draggedKey,
                    targetKey,
                });
            }
            delete cloned.dataset.drag;
        });
    }

    private handleClickAdd = () => {
        if (!this.addInput) return;

        const category = this.addInput.value;
        if (!category) return;

        if (hasCategory(category)) {
            alert("중복된 이름입니다.");
            this.addInput.value = "";
            return;
        }

        addCategory(category);

        const index = state.categorySort.length;
        const cloned = this.createItem(category, index);
        this.list?.appendChild(cloned);

        this.addInput.value = "";

        CustomEventEmitter.dispatch("categoryAdded", {
            category,
        });
    };

    private handleSubmit = (event: Event) => {
        event.preventDefault();
        this.handleClickAdd();
    };

    private handleClose = () => {
        this.hidden = true;
    };
}
