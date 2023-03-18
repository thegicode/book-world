var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CustomFetch } from '../../utils/index.js';
import { getState } from '../../modules/model.js';
export default class LibrarySearchByBook extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        const isbn = new URLSearchParams(location.search).get('isbn');
        this.fetchList(isbn);
    }
    fetchList(isbn) {
        return __awaiter(this, void 0, void 0, function* () {
            const favoriteLibraries = getState().regions;
            for (const regionName in favoriteLibraries) {
                const detailCodes = Object.values(favoriteLibraries[regionName]);
                if (detailCodes.length === 0)
                    return;
                const regionCode = detailCodes[0].slice(0, 2);
                detailCodes.forEach(detailCode => {
                    this.fetchLibrarySearchByBook(isbn, regionCode, detailCode);
                });
            }
        });
    }
    fetchLibrarySearchByBook(isbn, region, dtl_region) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchParams = new URLSearchParams({
                isbn,
                region,
                dtl_region
            });
            const url = `/library-search-by-book?${searchParams}`;
            try {
                const data = yield CustomFetch.fetch(url);
                this.render(data, isbn);
            }
            catch (error) {
                console.error(error);
                throw new Error(`Fail to get library search by book.`);
            }
        });
    }
    render({ libs }, isbn) {
        if (libs.length < 1)
            return;
        const container = document.querySelector('.library-search-by-book');
        if (!container)
            return;
        const listElement = document.createElement('ul');
        const fragment = new DocumentFragment();
        libs.forEach(({ homepage, libCode, libName }) => {
            const template = document.querySelector('#tp-librarySearchByBookItem');
            if (!template)
                return;
            const cloned = template.content.querySelector(':scope > *').cloneNode(true);
            const link = cloned.querySelector('a');
            if (!link)
                return;
            cloned.dataset.code = libCode;
            link.textContent = libName;
            link.href = homepage;
            this.loanAvailable(isbn, libCode, cloned.querySelector('p'));
            fragment.appendChild(cloned);
        });
        listElement.appendChild(fragment);
        container.appendChild(listElement);
    }
    loanAvailable(isbn, libCode, el) {
        return __awaiter(this, void 0, void 0, function* () {
            const isAvailable = yield this.fetchLoadnAvailabilty(isbn, libCode);
            const element = el.querySelector('.loanAvailable');
            if (element) {
                element.textContent = isAvailable ? '대출 가능' : '대출 불가';
                if (isAvailable && el.parentElement) {
                    el.parentElement.dataset.available = 'true';
                }
            }
        });
    }
    fetchLoadnAvailabilty(isbn13, libCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchParams = new URLSearchParams({
                isbn13,
                libCode
            });
            const url = `/book-exist?${searchParams}`;
            try {
                const data = yield CustomFetch.fetch(url, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                return data.loanAvailable === 'Y';
            }
            catch (error) {
                console.error(error);
                throw new Error(`Fail to get book exist.`);
            }
        });
    }
}
//# sourceMappingURL=LibrarySearchByBook.js.map