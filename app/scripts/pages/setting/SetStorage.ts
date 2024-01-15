import { CustomFetch } from "../../utils/index";
import bookModel from "../../model";
const SAMPLE_JSON_URL = `../../../assets/json/storage-sample.json`;

export default class SetStorage extends HTMLElement {
    private saveButton: HTMLButtonElement;
    private defaultButton: HTMLButtonElement;
    private resetButton: HTMLButtonElement;

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
    }

    connectedCallback() {
        this.saveButton.addEventListener("click", this.saveStorage);
        this.defaultButton.addEventListener(
            "click",
            this.setLocalStorageToBase
        );
        this.resetButton.addEventListener("click", this.resetStorage);
    }

    disconnectedCallback() {
        this.saveButton.removeEventListener("click", this.saveStorage);
        this.defaultButton.removeEventListener(
            "click",
            this.setLocalStorageToBase
        );
        this.resetButton.removeEventListener("click", this.resetStorage);
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

    private setLocalStorageToBase = async () => {
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
}
