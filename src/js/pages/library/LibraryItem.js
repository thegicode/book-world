import { addLibrary, removeLibrary, hasLibrary } from '../../modules/model.js';
export default class LibraryItem extends HTMLElement {
    constructor() {
        super();
        this.checkbox = null;
        this.libCode = '';
        this.libName = '';
        this.checkbox = this.querySelector('[name=myLibrary]');
    }
    connectedCallback() {
        var _a;
        this.render();
        (_a = this.checkbox) === null || _a === void 0 ? void 0 : _a.addEventListener('click', this.onChange.bind(this));
    }
    disconnectedCallback() {
        var _a;
        (_a = this.checkbox) === null || _a === void 0 ? void 0 : _a.removeEventListener('click', this.onChange);
    }
    render() {
        const data = JSON.parse(this.dataset.object || '');
        const { libCode, libName } = data;
        Object.entries(data).forEach(([key, value]) => {
            const element = this.querySelector(`.${key}`);
            if (element) {
                element.innerHTML = value;
            }
        });
        const hoempageLink = this.querySelector('.homepage');
        if (hoempageLink)
            hoempageLink.href = data.homepage;
        this.libCode = libCode;
        this.libName = libName;
        if (this.checkbox)
            this.checkbox.checked = hasLibrary(this.libCode);
    }
    onChange(event) {
        const target = event.target;
        if (target.checked) {
            addLibrary(this.libCode, this.libName);
        }
        else {
            removeLibrary(this.libCode);
        }
    }
}
//# sourceMappingURL=LibraryItem.js.map