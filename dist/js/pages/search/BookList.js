var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Observer, CustomFetch, CustomEventEmitter } from '../../utils/index.js';
export default class BookList extends HTMLElement {
    constructor() {
        super();
        this._initializeProperties();
        this._bindMethods();
    }
    _initializeProperties() {
        this.pagingInfo = this.querySelector('.paging-info');
        this.books = this.querySelector('.books');
    }
    _bindMethods() {
        this.fetchSearchNaverBook = this.fetchSearchNaverBook.bind(this);
    }
    connectedCallback() {
        this._setupObserver();
        CustomEventEmitter.add('search-page-init', this.onSearchPageInit.bind(this));
    }
    disconnectedCallback() {
        var _a;
        (_a = this.observer) === null || _a === void 0 ? void 0 : _a.disconnect();
        CustomEventEmitter.remove('search-page-init', this.onSearchPageInit);
    }
    _setupObserver() {
        const target = this.querySelector('.observe');
        const callback = this.fetchSearchNaverBook;
        this.observer = new Observer(target, callback);
    }
    onSearchPageInit(event) {
        const customEvent = event;
        this.keyword = customEvent.detail.keyword;
        this.length = 0;
        if (this.keyword) { // onSubmit으로 들어온 경우와 브라우저 
            this._handleKeywordPresent();
            return;
        }
        // keyword 없을 때 기본 화면 노출, 브라우저
        this._handleKeywordAbsent();
    }
    _handleKeywordPresent() {
        this.showMessage('loading');
        this.books.innerHTML = '';
        this.fetchSearchNaverBook();
    }
    _handleKeywordAbsent() {
        this.pagingInfo.hidden = true;
        this.showMessage('message');
    }
    fetchSearchNaverBook() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.keyword)
                return;
            const url = `/search-naver-book?keyword=${encodeURIComponent(this.keyword)}&display=${10}&start=${this.length + 1}`;
            try {
                const data = yield CustomFetch.fetch(url);
                this._render(data);
            }
            catch (error) {
                console.error(error);
                throw new Error('Fail to get naver book.');
            }
        });
    }
    _render(data) {
        const { total, display, items } = data;
        const prevLength = this.length;
        this.length += Number(display);
        this._updatePagingInfo({ total, display });
        this.pagingInfo.hidden = false;
        if (total === 0) {
            this.showMessage('notFound');
            return;
        }
        this._appendBookItems(items, prevLength);
        if (total !== this.length) {
            this.observer.observe();
        }
    }
    _updatePagingInfo({ total, display }) {
        const obj = {
            keyword: `${this.keyword}`,
            length: `${this.length.toLocaleString()}`,
            total: `${total.toLocaleString()}`,
            display: `${display}개씩`
        };
        for (const [key, value] of Object.entries(obj)) {
            this.pagingInfo.querySelector(`.__${key}`).textContent = value;
        }
    }
    _appendBookItems(items, prevLength) {
        const fragment = new DocumentFragment();
        items.forEach((item, index) => {
            const template = document.querySelector('[data-template=book-item]');
            const el = template.content.firstElementChild.cloneNode(true);
            el.data = item;
            el.index = prevLength + index;
            fragment.appendChild(el);
        });
        this.books.appendChild(fragment);
    }
    showMessage(type) {
        const template = document.querySelector(`#tp-${type}`);
        const el = template.content.firstElementChild.cloneNode(true);
        this.books.innerHTML = '';
        this.books.appendChild(el);
    }
}
// this.observer = new IntersectionObserver( changes => {
//     changes.forEach( change => {
//         if (change.isIntersecting) {
//             this.observer.unobserve(change.target)
//             this.fetchSearchNaverBook()
//         }   
//     })
// })
//# sourceMappingURL=BookList.js.map