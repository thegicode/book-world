"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("/js/components/index.js");
const Book_js_1 = __importDefault(require("./Book.js"));
const LibrarySearchByBook_js_1 = __importDefault(require("./LibrarySearchByBook.js"));
customElements.define('nav-gnb', index_js_1.NavGnb);
customElements.define('app-book', Book_js_1.default);
customElements.define('library-search-by-book', LibrarySearchByBook_js_1.default);
customElements.define('checkbox-favorite-book', index_js_1.CheckboxFavoriteBook);
customElements.define('book-image', index_js_1.BookImage);
//# sourceMappingURL=index.js.map