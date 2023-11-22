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
import bookStore2 from "../../modules/BookStore2";
export default class Library extends HTMLElement {
    constructor() {
        super();
        this._regionCode = null;
        this.PAGE_SIZE = 20;
        this.formElement = this.querySelector("form");
        this.itemTemplate = document.querySelector("#tp-item");
    }
    set regionCode(value) {
        this._regionCode = value;
        this.handleRegionCodeChange();
    }
    get regionCode() {
        return this._regionCode;
    }
    connectedCallback() {
        // start- library-header
    }
    handleRegionCodeChange() {
        if (!this.regionCode)
            return;
        this.showMessage("loading");
        this.fetchLibrarySearch(this.regionCode);
    }
    fetchLibrarySearch(regionCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/library-search?dtl_region=${regionCode}&page=1&pageSize=${this.PAGE_SIZE}`;
            try {
                const data = yield CustomFetch.fetch(url);
                this.renderLibraryList(data);
            }
            catch (error) {
                console.error(error);
                throw new Error("Fail to get library search data.");
            }
        });
    }
    renderLibraryList(data) {
        const { 
        // pageNo, pageSize, numFound, resultNum,
        libraries, } = data;
        if (libraries.length === 0) {
            this.showMessage("notFound");
            return;
        }
        const fragment = libraries.reduce((fragment, lib) => this.createLibraryItem(fragment, lib), new DocumentFragment());
        if (this.formElement) {
            this.formElement.innerHTML = "";
            this.formElement.appendChild(fragment);
        }
    }
    createLibraryItem(fragment, lib) {
        const libraryItem = cloneTemplate(this.itemTemplate);
        libraryItem.data = lib;
        if (bookStore2.hasLibrary(lib.libCode)) {
            libraryItem.dataset.has = "true";
            fragment.prepend(libraryItem);
            // fragment.insertBefore(libraryItem, fragment.firstChild);
        }
        else {
            fragment.appendChild(libraryItem);
        }
        return fragment;
    }
    showMessage(type) {
        const template = document.querySelector(`#tp-${type}`);
        if (template && this.formElement) {
            this.formElement.innerHTML = "";
            const clone = cloneTemplate(template);
            this.formElement.appendChild(clone);
        }
    }
}
//# sourceMappingURL=Library.js.map