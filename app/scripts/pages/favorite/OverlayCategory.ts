import {
    state,
    addCategory,
    hasCategory,
    updateCategory,
    deleteCategory,
} from "../../modules/model";
import { CustomEventEmitter } from "../../utils";

export default class OverlayCategory extends HTMLElement {
    form: HTMLFormElement | null;
    list: HTMLElement | null;
    template: HTMLTemplateElement | null;
    addButton: HTMLButtonElement | null;
    addInput: HTMLInputElement | null;
    closeButton: HTMLButtonElement | null;

    static get observedAttributes() {
        return ["hidden"];
    }

    constructor() {
        super();

        this.form = this.querySelector("form");
        this.list = this.querySelector(".category-list");
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
        const fragment = new DocumentFragment();
        Object.keys(state.category).forEach((category) => {
            const cloned = this.createItem(category);
            fragment.appendChild(cloned);
        });

        this.list?.appendChild(fragment);
    }

    private createItem(category: string) {
        const cloned = this.template?.content.firstElementChild?.cloneNode(
            true
        ) as HTMLElement;

        const input = cloned.querySelector(
            "input[name='category']"
        ) as HTMLInputElement;
        if (input) {
            input.value = category;
        }

        cloned.querySelector(".rename")?.addEventListener("click", () => {
            const value = input.value;
            if (value && category !== value) {
                updateCategory(category, value);

                CustomEventEmitter.dispatch("categoryRenamed", {
                    value,
                });
            }
        });

        cloned.querySelector(".delete")?.addEventListener("click", () => {
            const index = Object.keys(state.category).indexOf(category);

            cloned.remove();
            deleteCategory(category);

            CustomEventEmitter.dispatch("categoryDeleted", {
                index,
            });
        });

        return cloned;
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

        const cloned = this.createItem(category);
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
