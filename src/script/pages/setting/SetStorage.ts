import { IStorageData } from "../../modules/types";
import { CustomFetch } from "../../utils/index";
import { setState } from "../../modules/model";
// import { updateFavoriteBooksSize } from "../../modules/events.js";

export default class SetStorage extends HTMLElement {
    private storageButton: HTMLButtonElement;
    private resetButton: HTMLButtonElement;

    constructor() {
        super();
        this.storageButton = this.querySelector(
            ".localStorage button"
        ) as HTMLButtonElement;
        this.resetButton = this.querySelector(
            ".resetStorage button"
        ) as HTMLButtonElement;
    }

    connectedCallback() {
        this.storageButton.addEventListener(
            "click",
            this.setLocalStorageToBase.bind(this)
        );
        this.resetButton.addEventListener(
            "click",
            this.resetStorage.bind(this)
        );
    }

    disconnectedCallback() {
        this.storageButton.removeEventListener(
            "click",
            this.setLocalStorageToBase
        );
        this.resetButton.removeEventListener("click", this.resetStorage);
    }

    private async setLocalStorageToBase() {
        const url = `../../json/storage-sample.json`;
        try {
            const data = await CustomFetch.fetch<IStorageData>(url);
            setState(data);
            console.log("Saved local stronage by base data!");
            // CustomEventEmitter.dispatch('favorite-books-changed')
            // updateFavoriteBooksSize();
            location.reload();
        } catch (error) {
            console.error(error);
            throw new Error("Fail to get storage sample data.");
        }
    }

    private resetStorage() {
        localStorage.removeItem("BookWorld");
        // CustomEventEmitter.dispatch('favorite-books-changed', { size : 0 })
        // updateFavoriteBooksSize(0);
        location.reload();
    }
}
