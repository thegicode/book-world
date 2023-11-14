import { CustomFetch } from "../../utils/index";
// import { setState } from "../../modules/model";
import store from "../../modules/store";
// import { updateBookSizeInCategor } from "../../modules/events.js";

const LOCAL_STORAGE_NAME = "BookWorld";
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
            const data = await CustomFetch.fetch<IStorageData>(SAMPLE_JSON_URL);
            // setState(data);
            store.setState(data);
            console.log("Saved local stronage by base data!");

            // TODO
            this.updateAndReload();
        } catch (error) {
            console.error(error);
            throw new Error("Fail to get storage sample data.");
        }
    };

    private resetStorage = () => {
        // TODO
        localStorage.removeItem(LOCAL_STORAGE_NAME);
        this.updateAndReload();
    };

    private updateAndReload() {
        // CustomEventEmitter.dispatch('favorite-books-changed', { size : 0 })
        // updateBookSizeInCategor(0);
        location.reload();
    }
}
