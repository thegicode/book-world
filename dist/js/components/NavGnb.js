"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("/js/utils/index.js");
const model_js_1 = require("/js/modules/model.js");
class NavGnb extends HTMLElement {
    constructor() {
        super();
        this.favoriteBooksSize = this.getFavoriteBooksSize();
    }
    connectedCallback() {
        this.render();
        this.setSelectedMenu();
        index_js_1.CustomEventEmitter.add('favorite-books-changed', this.favoriteBooksChanged.bind(this));
    }
    disconnectedCallback() {
        index_js_1.CustomEventEmitter.remove('favorite-books-changed', this.favoriteBooksChanged);
    }
    getFavoriteBooksSize() {
        return (0, model_js_1.getState)().favoriteBooks.length;
    }
    render() {
        this.innerHTML = `
            <nav class="gnb">
                <a class="gnb-item" href="./search">책 검색</a>
                <a class="gnb-item" href="./favorite">나의 책 (<span class="size">${this.favoriteBooksSize}</span>)</a>
                <a class="gnb-item" href="./library">도서관 조회</a>
                <a class="gnb-item" href="./setting">설정</a>
            </nav>`;
    }
    setSelectedMenu() {
        const PATHS = ['/search', '/favorite', '/library', '/setting'];
        const idx = PATHS.indexOf(document.location.pathname);
        if (idx >= 0)
            this.querySelectorAll('a')[idx].ariaSelected = 'true';
    }
    favoriteBooksChanged({ detail }) {
        const { size } = detail;
        this.querySelector('.size').textContent = String(size || this.getFavoriteBooksSize());
    }
}
exports.default = NavGnb;
//# sourceMappingURL=NavGnb.js.map