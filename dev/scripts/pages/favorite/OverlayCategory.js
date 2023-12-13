import bookModel from "../../model";
import { cloneTemplate } from "../../utils/helpers";
export default class OverlayCategory extends HTMLElement {
    constructor() {
        super();
        this.draggedItem = null;
        this.handleClickAdd = () => {
            var _a;
            if (!this.addInput)
                return;
            const favorite = this.addInput.value;
            if (!favorite)
                return;
            if (bookModel.hasFavorite(favorite)) {
                alert("중복된 이름입니다.");
                this.addInput.value = "";
                return;
            }
            bookModel.addfavorite(favorite);
            const index = bookModel.sortedFavoriteKeys.length;
            const cloned = this.createItem(favorite, index);
            (_a = this.list) === null || _a === void 0 ? void 0 : _a.appendChild(cloned);
            this.addInput.value = "";
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
        bookModel.sortedFavoriteKeys.forEach((favorite, index) => {
            const cloned = this.createItem(favorite, index);
            fragment.appendChild(cloned);
        });
        this.list.appendChild(fragment);
    }
    createItem(favorite, index) {
        if (this.template === null) {
            throw new Error("Template is null");
        }
        const cloned = cloneTemplate(this.template);
        cloned.dataset.index = index.toString();
        cloned.dataset.favorite = favorite;
        const input = cloned.querySelector("input[name='category']");
        if (input) {
            input.value = favorite;
        }
        this.handleItemEvent(cloned, input, favorite);
        this.changeItem(cloned);
        return cloned;
    }
    handleItemEvent(cloned, input, favorite) {
        var _a, _b;
        (_a = cloned.querySelector(".renameButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            const favorite = cloned.dataset.favorite;
            this.handleRename(input, favorite, cloned);
        });
        (_b = cloned
            .querySelector(".deleteButton")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => this.handleDelete(cloned, favorite));
        cloned.addEventListener("keydown", (event) => {
            const input = event.target;
            if (event.key === "Enter" && input.name === "category") {
                this.handleRename(input, favorite);
            }
        });
    }
    handleRename(input, favorite, cloned) {
        const value = input.value;
        if (!value || favorite === value || !cloned)
            return;
        cloned.dataset.favorite = value;
        bookModel.renameFavorite(favorite, value);
    }
    handleDelete(cloned, favorite) {
        cloned.remove();
        bookModel.deleteFavorite(favorite);
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
            const draggedKey = this.draggedItem.dataset.favorite;
            const targetKey = cloned.dataset.favorite;
            if (draggedKey && targetKey) {
                bookModel.changeFavorite(draggedKey, targetKey);
            }
            delete cloned.dataset.drag;
        });
    }
}
//# sourceMappingURL=OverlayCategory.js.map