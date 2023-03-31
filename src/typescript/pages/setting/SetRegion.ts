import { TotalRegions } from "../../modules/types";
import { CustomEventEmitter, CustomFetch } from "../../utils/index";
import { getState, addRegion, removeRegion } from "../../modules/model";

export default class SetRegion extends HTMLElement {
    private regionData: TotalRegions | null;

    constructor() {
        super();
        this.regionData = null;
    }

    connectedCallback() {
        this.fetchRegion();
    }

    private async fetchRegion() {
        const url = "../../../assets/json/region.json";
        try {
            this.regionData = (await CustomFetch.fetch(url)) as TotalRegions;
            this.render();
            CustomEventEmitter.dispatch("fetch-region-data", {
                regionData: this.regionData,
            });
        } catch (error) {
            console.error(error);
            throw new Error("Fail to get region data.");
        }
    }

    private render() {
        if (!this.regionData) {
            throw new Error("regionData is null.");
        }

        const template = (
            document.querySelector("#tp-region") as HTMLTemplateElement
        ).content.firstElementChild;
        const container = this.querySelector(".regions") as HTMLElement;

        const regionData = this.regionData["region"];
        const fragment = new DocumentFragment();

        const stateRegions = Object.keys(getState().regions);
        for (const [key, value] of Object.entries(regionData)) {
            if (!template) return;
            const element = template.cloneNode(true) as HTMLElement;
            const checkbox = element.querySelector("input") as HTMLInputElement;
            checkbox.value = value;
            if (stateRegions.includes(key)) {
                checkbox.checked = true;
            }
            const spanElement = element.querySelector("span");
            if (spanElement) spanElement.textContent = key;
            fragment.appendChild(element);
        }
        container.appendChild(fragment);

        this.changeRegion();
    }

    private changeRegion() {
        const checkboxes =
            this.querySelectorAll<HTMLInputElement>("[name=region]");
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener("change", () => {
                const key =
                    (checkbox.nextElementSibling as HTMLElement).textContent ||
                    "";
                if (checkbox.checked) {
                    addRegion(key);
                } else {
                    removeRegion(key);
                }
                CustomEventEmitter.dispatch("set-favorite-regions", {});
            });
        });
    }
}
