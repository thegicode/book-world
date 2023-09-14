import { state, addCategory, hasCategory, updateCategory, deleteCategory, } from "../../modules/model";
import { CustomEventEmitter } from "../../utils";
export default class OverlayCategory extends HTMLElement {
    constructor() {
        super();
        this.handleClickAdd = () => {
            var _a;
            if (!this.addInput)
                return;
            const category = this.addInput.value;
            if (!category)
                return;
            if (hasCategory(category)) {
                alert("중복된 이름입니다.");
                this.addInput.value = "";
                return;
            }
            addCategory(category);
            const cloned = this.createItem(category);
            (_a = this.list) === null || _a === void 0 ? void 0 : _a.appendChild(cloned);
            this.addInput.value = "";
            CustomEventEmitter.dispatch("categoryAdded", {
                category,
            });
        };
        this.handleSubmit = (event) => {
            event.preventDefault();
            this.handleClickAdd();
        };
        this.handleClose = () => {
            this.hidden = true;
        };
        this.form = this.querySelector("form");
        this.list = this.querySelector(".category-list");
        this.template = document.querySelector("#tp-category-item");
        this.addButton = this.querySelector(".addButton");
        this.addInput = this.querySelector("input[name='add']");
        this.closeButton = this.querySelector(".closeButton");
    }
    static get observedAttributes() {
        return ["hidden"];
    }
    connectedCallback() {
        var _a, _b, _c;
        this.render();
        (_a = this.addButton) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.handleClickAdd);
        (_b = this.form) === null || _b === void 0 ? void 0 : _b.addEventListener("submit", this.handleSubmit);
        (_c = this.closeButton) === null || _c === void 0 ? void 0 : _c.addEventListener("click", this.handleClose);
    }
    disconnectedCallback() {
        var _a, _b, _c;
        (_a = this.addButton) === null || _a === void 0 ? void 0 : _a.removeEventListener("click", this.handleClickAdd);
        (_b = this.form) === null || _b === void 0 ? void 0 : _b.removeEventListener("submit", this.handleSubmit);
        (_c = this.closeButton) === null || _c === void 0 ? void 0 : _c.removeEventListener("click", this.handleClose);
    }
    attributeChangedCallback(name) {
        if (name === "hidden" && !this.hasAttribute("hidden")) {
            this.initial();
        }
    }
    initial() {
        if (this.list) {
            this.list.innerHTML = "";
            this.render();
        }
    }
    render() {
        var _a;
        const fragment = new DocumentFragment();
        Object.keys(state.category).forEach((category) => {
            const cloned = this.createItem(category);
            fragment.appendChild(cloned);
        });
        (_a = this.list) === null || _a === void 0 ? void 0 : _a.appendChild(fragment);
    }
    createItem(category) {
        var _a, _b, _c, _d;
        const cloned = (_b = (_a = this.template) === null || _a === void 0 ? void 0 : _a.content.firstElementChild) === null || _b === void 0 ? void 0 : _b.cloneNode(true);
        const input = cloned.querySelector("input[name='category']");
        if (input) {
            input.value = category;
        }
        (_c = cloned.querySelector(".rename")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
            const value = input.value;
            if (value && category !== value) {
                updateCategory(category, value);
                CustomEventEmitter.dispatch("categoryRenamed", {
                    value,
                });
            }
        });
        (_d = cloned.querySelector(".delete")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => {
            const index = Object.keys(state.category).indexOf(category);
            cloned.remove();
            deleteCategory(category);
            CustomEventEmitter.dispatch("categoryDeleted", {
                index,
            });
        });
        return cloned;
    }
}
//# sourceMappingURL=OverlayCategory.js.map