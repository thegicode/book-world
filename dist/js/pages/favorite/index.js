"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("/js/components/index.js");
const Favorite_js_1 = __importDefault(require("./Favorite.js"));
const FavoriteItem_js_1 = __importDefault(require("./FavoriteItem.js"));
customElements.define('nav-gnb', index_js_1.NavGnb);
customElements.define('app-favorite', Favorite_js_1.default);
customElements.define('favorite-item', FavoriteItem_js_1.default);
customElements.define('book-description', index_js_1.BookDescription);
customElements.define('library-book-exist', index_js_1.LibraryBookExist);
customElements.define('checkbox-favorite-book', index_js_1.CheckboxFavoriteBook);
customElements.define('book-image', index_js_1.BookImage);
//# sourceMappingURL=index.js.map