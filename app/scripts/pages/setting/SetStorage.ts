import { CustomFetch } from "../../utils/index";
import bookModel from "../../model";
const SAMPLE_JSON_URL = `../../../assets/json/storage-sample.json`;

export default class SetStorage extends HTMLElement {
    private saveButton: HTMLButtonElement;
    private defaultButton: HTMLButtonElement;
    private resetButton: HTMLButtonElement;
    private regisKeyTextarea: HTMLTextAreaElement;
    private regisButton: HTMLButtonElement;

    constructor() {
        super();

        this.saveButton = this.querySelector(
            ".saveStorage button"
        ) as HTMLButtonElement;
        this.defaultButton = this.querySelector(
            ".localStorage button"
        ) as HTMLButtonElement;
        this.resetButton = this.querySelector(
            ".resetStorage button"
        ) as HTMLButtonElement;
        this.regisKeyTextarea = this.querySelector(
            ".regisKey textarea"
        ) as HTMLTextAreaElement;
        this.regisButton = this.querySelector(
            ".regisKey button"
        ) as HTMLButtonElement;
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

    private saveStorage = () => {
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

    private setDefaultState = async () => {
        try {
            const data = await CustomFetch.fetch<IBookState>(SAMPLE_JSON_URL);

            bookModel.state = data;

            console.log("Saved local stronage by base data!");
        } catch (error) {
            console.error(error);
            throw new Error("Fail to get storage sample data.");
        }
    };

    private resetStorage = () => {
        bookModel.resetState();
    };

    private regisKey = async () => {
        const keyString = this.regisKeyTextarea.value;
        if (!this.validateKey(keyString)) return;

        const key = keyString.replace(/\n/g, "aaaaa");
        const response = await CustomFetch.fetch<any>(`/regis-key?key=${key}`);

        if (response) {
            console.log("success");
        }
    };

    private validateKey(keyString: string) {
        if (keyString.length > 0) {
            const names = [
                "LIBRARY_KEY",
                "NAVER_CLIENT_ID",
                "NAVER_SECRET_KEY",
            ];

            return names.every((n) => keyString.includes(n));
        } else return false;
    }
}
