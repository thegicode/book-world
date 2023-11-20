var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CustomFetch } from "../../utils/index";
import { cloneTemplate } from "../../utils/helpers";
import bookStore from "../../modules/BookStore";
export default class Library extends HTMLElement {
    constructor() {
        super();
        this._regionCode = null;
        this.PAGE_SIZE = 20;
    }
    set regionCode(value) {
        this._regionCode = value;
        this.handleRegionCodeChange();
    }
    get regionCode() {
        return this._regionCode;
    }
    connectedCallback() {
        this.form = this.querySelector("form");
    }
    fetchLibrarySearch(detailRegionCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/library-search?dtl_region=${detailRegionCode}&page=1&pageSize=${this.PAGE_SIZE}`;
            try {
                const data = yield CustomFetch.fetch(url);
                this.render(data);
            }
            catch (error) {
                console.error(error);
                throw new Error("Fail to get library search data.");
            }
        });
    }
    render(data) {
        const { 
        // pageNo, pageSize, numFound, resultNum,
        libraries, } = data;
        if (libraries.length === 0) {
            this.showMessage("notFound");
            return;
        }
        const template = document.querySelector("#tp-item");
        const fragment = libraries.reduce((fragment, lib) => {
            if (template) {
                const libraryItem = cloneTemplate(template);
                libraryItem.data = lib;
                if (bookStore.hasLibrary(lib.libCode)) {
                    libraryItem.dataset.has = "true";
                    fragment.prepend(libraryItem);
                    // fragment.insertBefore(libraryItem, fragment.firstChild);
                }
                else {
                    fragment.appendChild(libraryItem);
                }
            }
            return fragment;
        }, new DocumentFragment());
        if (this.form) {
            this.form.innerHTML = "";
            this.form.appendChild(fragment);
        }
    }
    showMessage(type) {
        const template = document.querySelector(`#tp-${type}`);
        if (template && this.form) {
            this.form.innerHTML = "";
            const clone = cloneTemplate(template);
            this.form.appendChild(clone);
        }
    }
    handleRegionCodeChange() {
        this.showMessage("loading");
        if (this.regionCode)
            this.fetchLibrarySearch(this.regionCode);
    }
}
//# sourceMappingURL=Library.js.map