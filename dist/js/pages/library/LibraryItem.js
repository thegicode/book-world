var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _LibraryItem_checkbox, _LibraryItem_libCode, _LibraryItem_libName;
import { addLibrary, removeLibrary, hasLibrary } from '../../modules/model.js';
export default class LibraryItem extends HTMLElement {
    constructor() {
        super();
        _LibraryItem_checkbox.set(this, null);
        _LibraryItem_libCode.set(this, '');
        _LibraryItem_libName.set(this, '');
        __classPrivateFieldSet(this, _LibraryItem_checkbox, this.querySelector('[name=myLibrary]') || null, "f");
        __classPrivateFieldSet(this, _LibraryItem_libCode, '', "f");
        __classPrivateFieldSet(this, _LibraryItem_libName, '', "f");
    }
    connectedCallback() {
        var _a;
        this.render();
        (_a = __classPrivateFieldGet(this, _LibraryItem_checkbox, "f")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', event => this.onChange.bind(this));
    }
    disconnectedCallback() {
        var _a;
        (_a = __classPrivateFieldGet(this, _LibraryItem_checkbox, "f")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', event => this.onChange);
    }
    render() {
        const data = JSON.parse(this.dataset.object || '');
        const keys = Object.keys(data);
        for (const key of keys) {
            const element = this.querySelector(`.${key}`);
            if (element) {
                element.innerHTML = `${data[key]}`;
            }
        }
        this.querySelector('.homepage').href = data.homepage;
        const { libCode, libName } = data;
        __classPrivateFieldSet(this, _LibraryItem_libCode, libCode, "f");
        __classPrivateFieldSet(this, _LibraryItem_libName, libName, "f");
        __classPrivateFieldGet(this, _LibraryItem_checkbox, "f").checked = hasLibrary(libCode);
    }
    onChange(event) {
        event.target.checked
            ? addLibrary(__classPrivateFieldGet(this, _LibraryItem_libCode, "f"), __classPrivateFieldGet(this, _LibraryItem_libName, "f"))
            : removeLibrary(__classPrivateFieldGet(this, _LibraryItem_libCode, "f"));
    }
}
_LibraryItem_checkbox = new WeakMap(), _LibraryItem_libCode = new WeakMap(), _LibraryItem_libName = new WeakMap();
//# sourceMappingURL=LibraryItem.js.map