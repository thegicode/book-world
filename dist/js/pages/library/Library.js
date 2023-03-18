var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CustomEventEmitter, CustomFetch } from '../../utils/index';
import { hasLibrary } from '../../modules/model';
export default class Library extends HTMLElement {
    constructor() {
        super();
        this.form = this.querySelector('form');
    }
    connectedCallback() {
        CustomEventEmitter.add('set-detail-region', this.handleDetailRegion.bind(this));
    }
    disconnectedCallback() {
        CustomEventEmitter.remove('set-detail-region', this.handleDetailRegion);
    }
    fetchLibrarySearch(detailRegionCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = `/library-search?dtl_region=${detailRegionCode}&page=${1}&pageSize=${20}`;
                const data = yield CustomFetch.fetch(url);
                this.render(data);
            }
            catch (error) {
                console.error(error);
                throw new Error('Fail to get library search data.');
            }
        });
    }
    render(data) {
        const { 
        // pageNo, pageSize, numFound, resultNum, 
        libs } = data;
        if (libs.length === 0) {
            this.showMessage('notFound');
            return;
        }
        const template = document.querySelector('#tp-item').content.firstElementChild;
        const fragment = libs.reduce((fragment, lib) => {
            if (template) {
                const element = template.cloneNode(true);
                element.data = lib;
                if (hasLibrary(lib.libCode)) {
                    element.dataset.has = 'true';
                    fragment.insertBefore(element, fragment.firstChild);
                }
                else {
                    fragment.appendChild(element);
                }
                return fragment;
            }
        }, new DocumentFragment());
        this.form.innerHTML = '';
        this.form.appendChild(fragment);
    }
    showMessage(type) {
        const template = document.querySelector('#tp-${type}').content.firstElementChild;
        if (template) {
            const element = template.cloneNode(true);
            this.form.innerHTML = '';
            this.form.appendChild(element);
        }
    }
    handleDetailRegion(evt) {
        this.showMessage('loading');
        this.fetchLibrarySearch(evt.detail.detailRegionCode);
    }
}
//# sourceMappingURL=Library.js.map