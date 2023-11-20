import bookStore from "../../modules/BookStore";
export default class LibraryItem extends HTMLElement {
    constructor() {
        super();
        this.checkbox = null;
        this.libCode = "";
        this.libName = "";
        this.checkbox =
            this.querySelector("[name=myLibrary]");
        this.onChange = this.onChange.bind(this);
    }
    connectedCallback() {
        var _a;
        this.render();
        (_a = this.checkbox) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.onChange);
    }
    disconnectedCallback() {
        var _a;
        (_a = this.checkbox) === null || _a === void 0 ? void 0 : _a.removeEventListener("click", this.onChange);
    }
    render() {
        const { data } = this;
        if (data === null)
            return;
        const { libCode, libName } = data;
        this.libCode = libCode;
        this.libName = libName;
        Object.entries(data).forEach(([key, value]) => {
            const element = this.querySelector(`.${key}`);
            if (element) {
                element.innerHTML = value;
            }
        });
        const hoempageLink = this.querySelector(".homepage");
        if (hoempageLink)
            hoempageLink.href = data.homepage;
        if (this.checkbox) {
            this.checkbox.checked = bookStore.hasLibrary(libCode);
        }
    }
    onChange() {
        var _a;
        if ((_a = this.checkbox) === null || _a === void 0 ? void 0 : _a.checked) {
            bookStore.addLibrary(this.libCode, this.libName);
        }
        else {
            bookStore.removeLibrary(this.libCode);
        }
    }
}
//# sourceMappingURL=LibraryItem.js.map