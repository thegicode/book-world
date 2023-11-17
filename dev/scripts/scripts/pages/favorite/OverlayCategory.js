import bookStore from "../../modules/BookStore";
import { CustomEventEmitter } from "../../utils";
import { cloneTemplate } from "../../utils/helpers";
export default class OverlayCategory extends HTMLElement {
    constructor() {
        super();
        this.draggedItem = null;
        this.handleClickAdd = () => {
            var _a;
            if (!this.addInput)
                return;
            const category = this.addInput.value;
            if (!category)
                return;
            if (bookStore.hasCategory(category)) {
                alert("중복된 이름입니다.");
                this.addInput.value = "";
                return;
            }
            bookStore.addCategory(category);
            bookStore.addCategorySort(category);
            const index = bookStore.categorySort.length;
            const cloned = this.createItem(category, index);
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
        this.renameButton = this.querySelector(".rename");
        this.addButton = this.querySelector(".addButton");
        this.addInput = this.querySelector("input[name='add']");
        this.closeButton = this.querySelector(".closeButton");
        this.draggedItem = null;
        this.handleRename = this.handleRename.bind(this);
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
        if (!this.list)
            return;
        const fragment = new DocumentFragment();
        bookStore.categorySort.forEach((category, index) => {
            const cloned = this.createItem(category, index);
            fragment.appendChild(cloned);
        });
        this.list.appendChild(fragment);
    }
    createItem(category, index) {
        if (this.template === null) {
            throw new Error("Template is null");
        }
        const cloned = cloneTemplate(this.template);
        cloned.dataset.index = index.toString();
        cloned.dataset.category = category;
        const input = cloned.querySelector("input[name='category']");
        if (input) {
            input.value = category;
        }
        this.handleItemEvent(cloned, input, category);
        this.changeItem(cloned);
        return cloned;
    }
    handleItemEvent(cloned, input, category) {
        var _a, _b;
        (_a = cloned
            .querySelector(".renameButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => this.handleRename(input, category));
        (_b = cloned
            .querySelector(".deleteButton")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => this.handleDelete(cloned, category));
        cloned.addEventListener("keydown", (event) => {
            const input = event.target;
            if (event.key === "Enter" && input.name === "category") {
                this.handleRename(input, category);
            }
        });
    }
    handleRename(input, category) {
        const value = input.value;
        if (!value || category === value)
            return;
        bookStore.renameCategory(category, value);
        bookStore.renameCategorySort(category, value);
        CustomEventEmitter.dispatch("categoryRenamed", {
            category,
            value,
        });
    }
    handleDelete(cloned, category) {
        const index = bookStore.categorySort.indexOf(category);
        cloned.remove();
        bookStore.deleteCategory(category);
        CustomEventEmitter.dispatch("categoryDeleted", {
            index,
        });
    }
    changeItem(cloned) {
        const dragggerButton = cloned.querySelector(".dragger");
        dragggerButton.addEventListener("mousedown", () => {
            cloned.draggable = true;
        });
        dragggerButton.addEventListener("mouseup", () => {
            cloned.removeAttribute("draggable");
        });
        cloned.addEventListener("dragstart", () => {
            this.draggedItem = cloned;
            cloned.draggable = true;
        });
        cloned.addEventListener("dragend", () => {
            if (this.draggedItem === cloned) {
                this.draggedItem = null;
                cloned.removeAttribute("draggable");
            }
        });
        cloned.addEventListener("dragover", (event) => {
            event.preventDefault();
        });
        cloned.addEventListener("dragenter", () => {
            if (this.draggedItem === cloned)
                return;
            cloned.dataset.drag = "dragenter";
        });
        // cloned.addEventListener("dragleave", () => {
        //     if (this.draggedItem === cloned) return;
        // });
        cloned.addEventListener("drop", () => {
            if (!this.draggedItem || !this.list)
                return;
            this.list.insertBefore(this.draggedItem, cloned);
            const draggedKey = this.draggedItem.dataset.category;
            const targetKey = cloned.dataset.category;
            if (draggedKey && targetKey) {
                bookStore.changeCategory(draggedKey, targetKey);
                CustomEventEmitter.dispatch("categoryChanged", {
                    draggedKey,
                    targetKey,
                });
            }
            delete cloned.dataset.drag;
        });
    }
}
//# sourceMappingURL=OverlayCategory.js.map