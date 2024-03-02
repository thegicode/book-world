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
// import { setState } from "../../modules/model";
import store from "../../modules/store";
// import { updateBookSizeInCategor } from "../../modules/events.js";
// const LOCAL_STORAGE_NAME = "BookWorld";
const SAMPLE_JSON_URL = `../../../assets/json/storage-sample.json`;
export default class SetState extends HTMLElement {
    constructor() {
        super();
        this.storageButton = null;
        this.resetButton = null;
        this.setLocalStorageToBase = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield CustomFetch.fetch(SAMPLE_JSON_URL);
                // setState(data);
                store.setState(data);
                console.log("Saved local stronage by base data!");
                // TODO
                this.updateAndReload();
            }
            catch (error) {
                console.error(error);
                throw new Error("Fail to get storage sample data.");
            }
        });
        this.resetStorage = () => {
            store.resetState();
            // localStorage.removeItem(LOCAL_STORAGE_NAME);
            // TODO
            this.updateAndReload();
        };
    }
    connectedCallback() {
        this.setSelectors();
        this.addEventListeners();
    }
    setSelectors() {
        this.storageButton = this.querySelector(".localStorage button");
        this.resetButton = this.querySelector(".resetStorage button");
    }
    addEventListeners() {
        var _a, _b;
        (_a = this.storageButton) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.setLocalStorageToBase);
        (_b = this.resetButton) === null || _b === void 0 ? void 0 : _b.addEventListener("click", this.resetStorage);
    }
    disconnectedCallback() {
        var _a, _b;
        (_a = this.storageButton) === null || _a === void 0 ? void 0 : _a.removeEventListener("click", this.setLocalStorageToBase);
        (_b = this.resetButton) === null || _b === void 0 ? void 0 : _b.removeEventListener("click", this.resetStorage);
    }
    updateAndReload() {
        // CustomEventEmitter.dispatch('favorite-books-changed', { size : 0 })
        // updateBookSizeInCategor(0);
        location.reload();
    }
}
//# sourceMappingURL=SetState.js.map