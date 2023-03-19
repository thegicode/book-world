var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CustomFetch, CustomEventEmitter } from '../../utils/index.js';
import { setState } from '../../modules/model.js';
export default class SetStorage extends HTMLElement {
    constructor() {
        super();
        this.storageButton = this.querySelector('.localStorage button');
        this.resetButton = this.querySelector('.resetStorage button');
    }
    connectedCallback() {
        this.storageButton.addEventListener('click', this.setLocalStorageToBase.bind(this));
        this.resetButton.addEventListener('click', this.resetStorage.bind(this));
    }
    disconnectedCallback() {
        this.storageButton.removeEventListener('click', this.setLocalStorageToBase);
        this.resetButton.removeEventListener('click', this.resetStorage);
    }
    setLocalStorageToBase() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `../../json/storage-sample.json`;
            try {
                const data = yield CustomFetch.fetch(url);
                setState(data);
                console.log('Saved local stronage by base data!');
                CustomEventEmitter.dispatch('favorite-books-changed');
            }
            catch (error) {
                console.error(error);
                throw new Error('Fail to get storage sample data.');
            }
        });
    }
    resetStorage() {
        localStorage.removeItem('BookWorld');
        CustomEventEmitter.dispatch('favorite-books-changed', { size: 0 });
    }
}
//# sourceMappingURL=SetStorage.js.map