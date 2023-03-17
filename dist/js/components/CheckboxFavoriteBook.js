"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("/js/utils/index.js");
const model_js_1 = require("/js/modules/model.js");
class CheckboxFavoriteBook extends HTMLElement {
    constructor() {
        super();
        this.$input = null;
        this.isbn = null;
    }
    connectedCallback() {
        var _a;
        const isbnElement = this.closest('[data-isbn]');
        this.isbn = isbnElement.dataset.isbn;
        this.render();
        (_a = this.$input) === null || _a === void 0 ? void 0 : _a.addEventListener('change', this.onChange.bind(this));
    }
    disconnectedCallback() {
        var _a;
        (_a = this.$input) === null || _a === void 0 ? void 0 : _a.addEventListener('change', this.onChange);
    }
    render() {
        const checked = (0, model_js_1.isFavoriteBook)(this.isbn) ? 'checked' : '';
        this.innerHTML = `<label>
            <input type="checkbox" name="favorite" ${checked}>
            <span>관심책</span>
        </label>`;
        this.$input = this.querySelector('input');
    }
    onChange() {
        var _a;
        const ISBN = this.isbn;
        if ((_a = this.$input) === null || _a === void 0 ? void 0 : _a.checked) {
            (0, model_js_1.addFavoriteBook)(ISBN);
        }
        else {
            (0, model_js_1.removeFavoriteBook)(ISBN);
        }
        index_js_1.CustomEventEmitter.dispatch('favorite-books-changed');
    }
}
exports.default = CheckboxFavoriteBook;
//# sourceMappingURL=CheckboxFavoriteBook.js.map