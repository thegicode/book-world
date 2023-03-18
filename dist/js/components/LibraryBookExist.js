var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default class LibraryBookExist extends HTMLElement {
    constructor() {
        super();
        this.root = this.querySelector('.library-list');
        this.itemTemplate = '';
    }
    connectedCallback() {
        this.itemTemplate = this.template();
    }
    onLibraryBookExist(button, isbn13, library) {
        return __awaiter(this, void 0, void 0, function* () {
            const entries = Object.entries(library);
            this.loading(entries.length);
            if (button) {
                button.disabled = true;
            }
            const promises = entries.map(([libCode, libName], index) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch(`/book-exist?isbn13=${isbn13}&libCode=${libCode}`);
                    const data = yield response.json();
                    this.renderBookExist(data, libName, index);
                }
                catch (error) {
                    console.error(error);
                    throw error;
                }
            }));
            try {
                yield Promise.all(promises);
                this.removeLoading();
            }
            catch (error) {
                console.error('Failed to fetch data for some libraries');
            }
            // Promise.all(promises)
            //     .then( () => {
            //         this.removeLoading()
            //     })
            //     .catch( () => {
            //         console.error('Failed to fetch data for some libraries')
            //     })
        });
    }
    renderBookExist(data, libName, index) {
        const { hasBook, loanAvailable } = data;
        const _hasBook = hasBook === 'Y' ? '소장, ' : '미소장';
        let _loanAvailable = '';
        if (hasBook === 'Y') {
            _loanAvailable = loanAvailable === 'Y' ? '대출가능' : '대출불가';
        }
        const el = this.querySelectorAll('.library-item')[index];
        const elName = el.querySelector('.name');
        if (elName) {
            elName.textContent = `☼ ${libName} : `;
        }
        const elHasBook = el.querySelector('.hasBook');
        if (elHasBook) {
            elHasBook.textContent = _hasBook;
        }
        const elLoanAvailable = el.querySelector('.loanAvailable');
        if (elLoanAvailable) {
            elLoanAvailable.textContent = _loanAvailable;
        }
    }
    loading(size) {
        let tp = '';
        while (size > 0) {
            tp += this.itemTemplate;
            size--;
        }
        this.root.innerHTML = tp;
    }
    removeLoading() {
        const loadingItems = this.querySelectorAll('.library-item[data-loading=true]');
        loadingItems.forEach(el => {
            delete el.dataset.loading;
        });
    }
    template() {
        return `<li class="library-item" data-loading="true">
            <span class="name"></span>
            <span class="hasBook"></span>
            <span class="loanAvailable"></span>
        </li>`;
    }
}
//# sourceMappingURL=LibraryBookExist.js.map