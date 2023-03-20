import { addFavoriteBook, removeFavoriteBook, isFavoriteBook } from '../modules/model.js';
import { updateFavoriteBooksSize } from '../modules/events.js';
export default class CheckboxFavoriteBook extends HTMLElement {
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
        const isbn = this.isbn || '';
        const checked = isFavoriteBook(isbn) ? 'checked' : '';
        this.innerHTML = `<label>
            <input type="checkbox" name="favorite" ${checked}>
            <span>관심책</span>
        </label>`;
        this.$input = this.querySelector('input');
    }
    onChange() {
        var _a;
        const ISBN = this.isbn || '';
        if ((_a = this.$input) === null || _a === void 0 ? void 0 : _a.checked) {
            addFavoriteBook(ISBN);
        }
        else {
            removeFavoriteBook(ISBN);
        }
        // CustomEventEmitter.dispatch('favorite-books-changed')
        updateFavoriteBooksSize();
    }
}
//# sourceMappingURL=CheckboxFavoriteBook.js.map