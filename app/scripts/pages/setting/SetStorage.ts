import { CustomFetch } from "../../utils/index";
import bookStore from "../../modules/BookStore";
import { publishers } from "../../modules/actions";
const SAMPLE_JSON_URL = `../../../assets/json/storage-sample.json`;

export default class SetStorage extends HTMLElement {
    private saveButton: HTMLElement | null = null;
    private defaultButton: HTMLElement | null = null;
    private resetButton: HTMLElement | null = null;

    constructor() {
        super();

        this.saveButton = this.querySelector(
            ".saveStorage button"
        ) as HTMLElement;
        this.defaultButton = this.querySelector(
            ".localStorage button"
        ) as HTMLElement;
        this.resetButton = this.querySelector(
            ".resetStorage button"
        ) as HTMLElement;
    }

    connectedCallback() {
        this.saveButton?.addEventListener("click", this.savetStorage);
        this.defaultButton?.addEventListener(
            "click",
            this.setLocalStorageToBase
        );
        this.resetButton?.addEventListener("click", this.resetStorage);
    }

    disconnectedCallback() {
        this.saveButton?.removeEventListener("click", this.savetStorage);
        this.defaultButton?.removeEventListener(
            "click",
            this.setLocalStorageToBase
        );
        this.resetButton?.removeEventListener("click", this.resetStorage);
    }

    private savetStorage = () => {
        const state = bookStore.storage;
        if (!state) return;
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
            .then(function (responseText: string) {
                console.log(
                    "데이터가 서버에 성공적으로 전송되었습니다.",
                    responseText
                );
            })
            .catch(function (error) {
                console.error("데이터 전송 중 오류 발생:", error);
            });
    };

    private setLocalStorageToBase = async () => {
        try {
            const data = await CustomFetch.fetch<IBookState>(SAMPLE_JSON_URL);

            bookStore.storage = data;

            console.log("Saved local stronage by base data!");

            this.updatePage();
        } catch (error) {
            console.error(error);
            throw new Error("Fail to get storage sample data.");
        }
    };

    private resetStorage = () => {
        bookStore.reset();

        this.updatePage();
    };

    private updatePage() {
        publishers.categoryBookUpdate.notify();
        publishers.bookStateUpdate.notify();
    }
}
