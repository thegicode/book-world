import {
    state,
    addCategory,
    hasCategory,
    deleteCategory,
} from "../../modules/model";

export default class ModalCategory extends HTMLElement {
    form: HTMLFormElement | null;
    listElement: HTMLElement | null;
    template: HTMLTemplateElement | null;
    addButton: HTMLButtonElement | null;
    addInput: HTMLInputElement | null;
    closeButton: HTMLButtonElement | null;

    constructor() {
        super();

        this.form = this.querySelector("form");
        this.listElement = this.querySelector(".category-list");
        this.template = document.querySelector("#tp-category-item");
        this.addButton = this.querySelector(".addButton");
        this.addInput = this.querySelector("input[name='add']");
        this.closeButton = this.querySelector(".closeButton");
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

    private render() {
        const fragment = new DocumentFragment();
        Object.keys(state.category).forEach((category) => {
            const cloned = this.createItem(category);
            fragment.appendChild(cloned);
        });

        this.listElement?.appendChild(fragment);
    }

    private createItem(category: string) {
        const cloned = this.template?.content.firstElementChild?.cloneNode(
            true
        ) as HTMLElement;

        const label = cloned.querySelector(".label");
        if (label) {
            label.textContent = category;
        }

        cloned.querySelector(".deleteButton")?.addEventListener("click", () => {
            cloned.remove();
            deleteCategory(category);
        });

        return cloned;
    }

    private handleClickAdd = () => {
        if (!this.addInput) return;

        const category = this.addInput.value;

        if (category) {
            if (hasCategory(category)) {
                alert("중복된 이름입니다.");
                this.addInput.value = "";
                return;
            }

            addCategory(category);

            const cloned = this.createItem(category);
            this.listElement?.appendChild(cloned);

            this.addInput.value = "";
        }
    };

    private handleSubmit = (event: Event) => {
        event.preventDefault();
        this.handleClickAdd();
    };

    private handleClose = () => {
        this.hidden = true;
    };
}
