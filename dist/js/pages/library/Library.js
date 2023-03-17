"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../../utils/index.js");
const model_js_1 = require("../../modules/model.js");
class Library extends HTMLElement {
    constructor() {
        super();
        this.form = this.querySelector('form');
    }
    connectedCallback() {
        index_js_1.CustomEventEmitter.add('set-detail-region', this.handleDetailRegion.bind(this));
    }
    disconnectedCallback() {
        index_js_1.CustomEventEmitter.remove('set-detail-region', this.handleDetailRegion);
    }
    fetchLibrarySearch(detailRegionCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = `/library-search?dtl_region=${detailRegionCode}&page=${1}&pageSize=${20}`;
                const data = yield index_js_1.CustomFetch.fetch(url);
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
                if ((0, model_js_1.hasLibrary)(lib.libCode)) {
                    element.dataset.has = true;
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
        const tpl = document.querySelector(`#tp-${type}`);
        const el = tpl.content.firstElementChild.cloneNode(true);
        this.form.innerHTML = '';
        this.form.appendChild(el);
    }
    handleDetailRegion({ detail }) {
        this.showMessage('loading');
        this.fetchLibrarySearch(detail.detailRegionCode);
    }
}
exports.default = Library;
//# sourceMappingURL=Library.js.map