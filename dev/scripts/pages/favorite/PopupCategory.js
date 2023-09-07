import { state, addCategory, hasCategory, deleteCategory, } from "../../modules/model";
export default class ModalCategory extends HTMLElement {
    constructor() {
        super();
        this.handleClickAdd = () => {
            var _a;
            if (!this.addInput)
                return;
            const category = this.addInput.value;
            if (category) {
                if (hasCategory(category)) {
                    alert("중복된 이름입니다.");
                    this.addInput.value = "";
                    return;
                }
                addCategory(category);
                const cloned = this.createItem(category);
                (_a = this.listElement) === null || _a === void 0 ? void 0 : _a.appendChild(cloned);
                this.addInput.value = "";
            }
        };
        this.handleSubmit = (event) => {
            event.preventDefault();
            this.handleClickAdd();
        };
        this.handleClose = () => {
            this.hidden = true;
        };
        this.form = this.querySelector("form");
        this.listElement = this.querySelector(".category-list");
        this.template = document.querySelector("#tp-category-item");
        this.addButton = this.querySelector(".addButton");
        this.addInput = this.querySelector("input[name='add']");
        this.closeButton = this.querySelector(".closeButton");
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
    render() {
        var _a;
        const fragment = new DocumentFragment();
        Object.keys(state.category).forEach((category) => {
            const cloned = this.createItem(category);
            fragment.appendChild(cloned);
        });
        (_a = this.listElement) === null || _a === void 0 ? void 0 : _a.appendChild(fragment);
    }
    createItem(category) {
        var _a, _b, _c;
        const cloned = (_b = (_a = this.template) === null || _a === void 0 ? void 0 : _a.content.firstElementChild) === null || _b === void 0 ? void 0 : _b.cloneNode(true);
        const label = cloned.querySelector(".label");
        if (label) {
            label.textContent = category;
        }
        (_c = cloned.querySelector(".deleteButton")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
            cloned.remove();
            deleteCategory(category);
        });
        return cloned;
    }
}
//# sourceMappingURL=PopupCategory.js.map