import { CustomEventEmitter, CustomFetch } from "../../utils/index";
import { getState, addRegion, removeRegion } from "../../modules/model";

const FETCH_REGION_DATA_EVENT = "fetch-region-data";
const SET_FAVORITE_REGIONS_EVENT = "set-favorite-regions";
const REGION_JSON_URL = "../../../assets/json/region.json";

export default class SetRegion extends HTMLElement {
    private regionData: TotalRegions | null;

    constructor() {
        super();
        this.regionData = null;
    }

    connectedCallback() {
        this.initializeRegionDataAndRender();
    }

    private async initializeRegionDataAndRender() {
        try {
            this.regionData = await this.fetchRegionData(REGION_JSON_URL);

            this.renderRegion();
            this.addCheckboxChangeListeners();

            CustomEventEmitter.dispatch(FETCH_REGION_DATA_EVENT, {
                regionData: this.regionData,
            });
        } catch (error) {
            console.error(error);
            throw new Error("Fail to get region data.");
        }
    }

    private async fetchRegionData(url: string) {
        return (await CustomFetch.fetch(url)) as TotalRegions;
    }

    private renderRegion() {
        const template = (
            document.querySelector("#tp-region") as HTMLTemplateElement
        ).content.firstElementChild;
        if (!template) return;

        const regionElementsFragment =
            this.createRegionElementsFragment(template);

        const container = this.querySelector(".regions") as HTMLElement;
        container.appendChild(regionElementsFragment);
    }

    private createRegionElementsFragment(template: Element) {
        if (!this.regionData) {
            throw new Error("regionData is null.");
        }

        const fragment = new DocumentFragment();

        const regionData = this.regionData["region"];
        const favoriteRegions = Object.keys(getState().regions);

        for (const [key, value] of Object.entries(regionData)) {
            const regionElement = this.createRegionElement(
                template,
                key,
                value,
                favoriteRegions
            );
            fragment.appendChild(regionElement);
        }

        return fragment;
    }

    private createRegionElement(
        template: Element,
        key: string,
        value: string,
        favoriteRegions: string[]
    ) {
        const regionElement = template.cloneNode(true) as HTMLElement;
        const checkbox = regionElement.querySelector(
            "input"
        ) as HTMLInputElement;
        checkbox.value = value;
        checkbox.checked = favoriteRegions.includes(key);

        const spanElement = regionElement.querySelector("span");
        if (spanElement) spanElement.textContent = key;

        return regionElement;
    }

    private addCheckboxChangeListeners() {
        const checkboxes =
            this.querySelectorAll<HTMLInputElement>("[name=region]");
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener(
                "change",
                this.createCheckboxChangeListener(checkbox)
            );
        });
    }

    private createCheckboxChangeListener(checkbox: HTMLInputElement) {
        return () => {
            const key =
                (checkbox.nextElementSibling as HTMLElement).textContent || "";
            if (checkbox.checked) {
                addRegion(key);
            } else {
                removeRegion(key);
            }
            CustomEventEmitter.dispatch(SET_FAVORITE_REGIONS_EVENT, {});
        };
    }
}
