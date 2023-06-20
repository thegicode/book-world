var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CustomEventEmitter, CustomFetch } from "../../utils/index";
import { hasLibrary } from "../../modules/model";
export default class Library extends HTMLElement {
    constructor() {
        super();
        this.PAGE_SIZE = 20;
        this.EVENT_NAME = "set-detail-region";
        this.handleDetailRegion = this.handleDetailRegion.bind(this);
    }
    connectedCallback() {
        this.form = this.querySelector("form");
        CustomEventEmitter.add(this.EVENT_NAME, this.handleDetailRegion);
    }
    disconnectedCallback() {
        CustomEventEmitter.remove(this.EVENT_NAME, this.handleDetailRegion);
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
            if (template === null || template === void 0 ? void 0 : template.content.firstElementChild) {
                const libraryItem = template.content.firstElementChild.cloneNode(true);
                libraryItem.dataset.object = JSON.stringify(lib);
                if (hasLibrary(lib.libCode)) {
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
        if ((template === null || template === void 0 ? void 0 : template.content.firstElementChild) && this.form) {
            this.form.innerHTML = "";
            this.form.appendChild(template.content.firstElementChild.cloneNode(true));
        }
    }
    handleDetailRegion(evt) {
        this.showMessage("loading");
        this.fetchLibrarySearch(evt.detail.detailRegionCode);
    }
}
//# sourceMappingURL=Library.js.map