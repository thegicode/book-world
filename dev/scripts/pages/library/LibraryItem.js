import store from "../../modules/store";
export default class LibraryItem extends HTMLElement {
    constructor() {
        super();
        this.checkbox = null;
        this.libCode = "";
        this.libName = "";
        this.onChange = this.onChange.bind(this);
    }
    connectedCallback() {
        var _a;
        this.checkbox =
            this.querySelector("[name=myLibrary]");
        this.render();
        (_a = this.checkbox) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.onChange);
    }
    disconnectedCallback() {
        var _a;
        (_a = this.checkbox) === null || _a === void 0 ? void 0 : _a.removeEventListener("click", this.onChange);
    }
    render() {
        if (this.dataset.object === undefined || !this.checkbox)
            return;
        const data = JSON.parse(this.dataset.object);
        const { libCode, libName } = data;
        Object.entries(data).forEach(([key, value]) => {
            const element = this.querySelector(`.${key}`);
            if (element) {
                element.innerHTML = value;
            }
        });
        const hoempageLink = this.querySelector(".homepage");
        if (hoempageLink)
            hoempageLink.href = data.homepage;
        this.libCode = libCode;
        this.libName = libName;
        if (this.checkbox)
            this.checkbox.checked = store.hasLibrary(this.libCode);
    }
    onChange(event) {
        const target = event.target;
        if (!target)
            return;
        if (target.checked) {
            store.addLibrary(this.libCode, this.libName);
        }
        else {
            store.removeLibrary(this.libCode);
        }
    }
}
//# sourceMappingURL=LibraryItem.js.map