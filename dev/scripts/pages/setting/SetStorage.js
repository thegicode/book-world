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
import bookStore from "../../modules/BookStore";
import { publishers } from "../../modules/actions";
const SAMPLE_JSON_URL = `../../../assets/json/storage-sample.json`;
export default class SetStorage extends HTMLElement {
    constructor() {
        super();
        this.saveButton = null;
        this.defaultButton = null;
        this.resetButton = null;
        this.savetStorage = () => {
            const state = bookStore.storage;
            if (!state)
                return;
            fetch(SAMPLE_JSON_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "appication/json",
                },
                body: JSON.stringify(bookStore.storage),
            })
                .then(function (reponse) {
                if (!reponse.ok) {
                    throw new Error("서버 응답 오류" + reponse.status);
                }
                return reponse.text();
            })
                .then(function (responseText) {
                console.log("데이터가 서버에 성공적으로 전송되었습니다.", responseText);
            })
                .catch(function (error) {
                console.error("데이터 전송 중 오류 발생:", error);
            });
        };
        this.setLocalStorageToBase = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield CustomFetch.fetch(SAMPLE_JSON_URL);
                bookStore.storage = data;
                console.log("Saved local stronage by base data!");
                this.updatePage();
            }
            catch (error) {
                console.error(error);
                throw new Error("Fail to get storage sample data.");
            }
        });
        this.resetStorage = () => {
            bookStore.reset();
            this.updatePage();
        };
        this.saveButton = this.querySelector(".saveStorage button");
        this.defaultButton = this.querySelector(".localStorage button");
        this.resetButton = this.querySelector(".resetStorage button");
    }
    connectedCallback() {
        var _a, _b, _c;
        (_a = this.saveButton) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.savetStorage);
        (_b = this.defaultButton) === null || _b === void 0 ? void 0 : _b.addEventListener("click", this.setLocalStorageToBase);
        (_c = this.resetButton) === null || _c === void 0 ? void 0 : _c.addEventListener("click", this.resetStorage);
    }
    disconnectedCallback() {
        var _a, _b, _c;
        (_a = this.saveButton) === null || _a === void 0 ? void 0 : _a.removeEventListener("click", this.savetStorage);
        (_b = this.defaultButton) === null || _b === void 0 ? void 0 : _b.removeEventListener("click", this.setLocalStorageToBase);
        (_c = this.resetButton) === null || _c === void 0 ? void 0 : _c.removeEventListener("click", this.resetStorage);
    }
    updatePage() {
        publishers.categoryBookUpdate.notify();
        publishers.bookStateUpdate.notify();
    }
}
//# sourceMappingURL=SetStorage.js.map