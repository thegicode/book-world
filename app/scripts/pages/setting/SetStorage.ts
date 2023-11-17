import { CustomFetch } from "../../utils/index";
import bookStore, {
    categoryBookUpdatePublisher,
    bookStateUpdatePublisher,
} from "../../modules/BookStore";

const SAMPLE_JSON_URL = `../../../assets/json/storage-sample.json`;

export default class SetStorage extends HTMLElement {
    private storageButton: HTMLElement | null = null;
    private resetButton: HTMLElement | null = null;

    constructor() {
        super();
    }

    connectedCallback() {
        this.setSelectors();
        this.addEventListeners();
    }

    private setSelectors() {
        this.storageButton = this.querySelector(
            ".localStorage button"
        ) as HTMLElement;
        this.resetButton = this.querySelector(
            ".resetStorage button"
        ) as HTMLElement;
    }

    private addEventListeners() {
        this.storageButton?.addEventListener(
            "click",
            this.setLocalStorageToBase
        );
        this.resetButton?.addEventListener("click", this.resetStorage);
    }

    disconnectedCallback() {
        this.storageButton?.removeEventListener(
            "click",
            this.setLocalStorageToBase
        );
        this.resetButton?.removeEventListener("click", this.resetStorage);
    }

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
        categoryBookUpdatePublisher.notify();
        bookStateUpdatePublisher.notify();
    }
}
