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
import bookModel from "../../model";
const SAMPLE_JSON_URL = `../../../assets/json/storage-sample.json`;
export default class SetStorage extends HTMLElement {
    constructor() {
        super();
        this.saveStorage = () => {
            // Blob 객체 생성
            const blob = new Blob([JSON.stringify(bookModel.state)], {
                type: "application/json",
            });
            // a 태그를 생성하여 다운로드 링크로 사용
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "storage-sample.json"; // 파일명 지정
            // a 태그를 클릭하여 다운로드 시작
            a.click();
            // URL.createObjectURL()로 생성된 URL 해제
            URL.revokeObjectURL(a.href);
        };
        this.setDefaultState = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield CustomFetch.fetch(SAMPLE_JSON_URL);
                bookModel.state = data;
                console.log("Saved local stronage by base data!");
            }
            catch (error) {
                console.error(error);
                throw new Error("Fail to get storage sample data.");
            }
        });
        this.resetStorage = () => {
            bookModel.resetState();
        };
        this.regisKey = () => __awaiter(this, void 0, void 0, function* () {
            const keyString = this.regisKeyTextarea.value;
            if (!this.validateKey(keyString))
                return;
            const key = keyString.replace(/\n/g, "aaaaa");
            const response = yield CustomFetch.fetch(`/regis-key?key=${key}`);
            if (response) {
                console.log("success");
            }
        });
        this.saveButton = this.querySelector(".saveStorage button");
        this.defaultButton = this.querySelector(".localStorage button");
        this.resetButton = this.querySelector(".resetStorage button");
        this.regisKeyTextarea = this.querySelector(".regisKey textarea");
        this.regisButton = this.querySelector(".regisKey button");
    }
    connectedCallback() {
        this.saveButton.addEventListener("click", this.saveStorage);
        this.defaultButton.addEventListener("click", this.setDefaultState);
        this.resetButton.addEventListener("click", this.resetStorage);
        this.regisButton.addEventListener("click", this.regisKey);
    }
    disconnectedCallback() {
        this.saveButton.removeEventListener("click", this.saveStorage);
        this.defaultButton.removeEventListener("click", this.setDefaultState);
        this.regisButton.removeEventListener("click", this.resetStorage);
        this.regisButton.removeEventListener("click", this.regisKey);
    }
    validateKey(keyString) {
        if (keyString.length > 0) {
            const names = [
                "LIBRARY_KEY",
                "NAVER_CLIENT_ID",
                "NAVER_SECRET_KEY",
            ];
            return names.every((n) => keyString.includes(n));
        }
        else
            return false;
    }
}
//# sourceMappingURL=SetStorage.js.map