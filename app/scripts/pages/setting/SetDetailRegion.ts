import { CustomEventEmitter } from "../../utils/index";
import { cloneTemplate } from "../../utils/helpers";
import store from "../../modules/store";

const FETCH_REGION_DATA_EVENT = "fetch-region-data";
const SET_FAVORITE_REGIONS_EVENT = "set-favorite-regions";
const SET_DETAIL_REGIONS_EVENT = "set-detail-regions";

export default class SetDetailRegion extends HTMLElement {
    private regionData: TotalRegions | null;
    private region: string;

    constructor() {
        super();
        this.regionData = null;
        this.region = "";

        this.setRegionData = this.setRegionData.bind(this);
        this.renderRegion = this.renderRegion.bind(this);
    }

    connectedCallback() {
        CustomEventEmitter.add(FETCH_REGION_DATA_EVENT, this.setRegionData);
        CustomEventEmitter.add(SET_FAVORITE_REGIONS_EVENT, this.renderRegion);
    }

    disconnectedCallback() {
        CustomEventEmitter.remove(FETCH_REGION_DATA_EVENT, this.setRegionData);
        CustomEventEmitter.remove(
            SET_FAVORITE_REGIONS_EVENT,
            this.renderRegion
        );
    }

    private setRegionData(event: Event) {
        const customEvent = event as CustomEvent<{ regionData: TotalRegions }>;
        this.regionData = customEvent.detail.regionData;
        this.renderRegion();
    }

    private renderRegion() {
        const favoriteRegions = Object.keys(store.regions);

        if (favoriteRegions.length < 1) return;

        const container = this.querySelector(".regions") as HTMLElement;
        if (!container) return;

        container.innerHTML = "";
        const regionElements = this.createRegions(favoriteRegions);
        if (!regionElements) return;

        container.appendChild(regionElements);

        this.initializeFirstRegion(container);
    }

    private createRegions(favoriteRegions: string[]) {
        const template = document.querySelector(
            "#tp-favorite-region"
        ) as HTMLTemplateElement;

        const fragment = new DocumentFragment();
        favoriteRegions.forEach((region) => {
            const element = cloneTemplate(template);
            const spanElement = element.querySelector<HTMLElement>("span");
            if (spanElement) spanElement.textContent = region;

            fragment.appendChild(element);
        });
        return fragment;
    }

    private initializeFirstRegion(container: HTMLElement) {
        const firstInput = container.querySelector<HTMLInputElement>("input");
        if (!firstInput) return;

        firstInput.checked = true;
        const labelEl = firstInput.nextElementSibling as HTMLElement;
        const label = labelEl?.textContent || "";

        this.renderDetailRegions(label);
        this.changeRegion();
    }

    private renderDetailRegions(regionName: string) {
        if (!this.regionData) return;

        const detailRegionsElement = this.querySelector(
            ".detailRegions"
        ) as HTMLElement;
        if (!detailRegionsElement) return;

        const regionObj = store.regions[regionName];
        const regionCodes = regionObj ? Object.values(regionObj) : [];

        const template = document.querySelector(
            "#tp-detail-region"
        ) as HTMLTemplateElement;
        if (!template) return;

        detailRegionsElement.innerHTML = "";

        const detailRegionData = this.regionData.detailRegion[regionName];
        if (!detailRegionData) return;

        const fragment = this.createDetailRegionElements(
            detailRegionData,
            template,
            regionCodes
        );

        detailRegionsElement.appendChild(fragment);

        this.region = regionName;
        this.onChangeDetail();
    }

    private createDetailRegionElements(
        detailRegionData: { [key: string]: string },
        template: HTMLTemplateElement,
        regionCodes: string[]
    ): DocumentFragment {
        const fragment = new DocumentFragment();

        for (const [key, value] of Object.entries(detailRegionData)) {
            const element = cloneTemplate(template);
            const spanElement = element.querySelector("span");
            if (spanElement) spanElement.textContent = key;
            const input = element.querySelector<HTMLInputElement>("input");
            if (input) {
                input.value = value;
                if (regionCodes.includes(value)) {
                    input.checked = true;
                    fragment.insertBefore(element, fragment.firstChild);
                } else {
                    fragment.appendChild(element);
                }
            }
        }
        return fragment;
    }

    private changeRegion() {
        const regionRadios = this.querySelectorAll("[name=favorite-region]");
        Array.from(regionRadios).forEach((radio: Element) => {
            const inputRadio = radio as HTMLInputElement;
            inputRadio.addEventListener("change", () => {
                if (inputRadio.checked) {
                    const labelElement =
                        inputRadio.nextElementSibling as HTMLElement;
                    const label = labelElement?.textContent || "";
                    this.renderDetailRegions(label);
                }
            });
        });
    }

    private onChangeDetail() {
        const region = this.region;

        if (!store.regions[region]) {
            store.addRegion(region);
        }
        const checkboxes = document.querySelectorAll("[name=detailRegion]");

        checkboxes.forEach((checkbox: Element) => {
            const inputCheckbox = checkbox as HTMLInputElement;
            inputCheckbox.addEventListener("change", () => {
                const { value } = inputCheckbox;
                const labelElement =
                    inputCheckbox.nextElementSibling as HTMLElement;
                const label = labelElement?.textContent || "";
                if (inputCheckbox.checked) {
                    store.addDetailRegion(region, label, value);
                } else {
                    store.removeDetailRegion(region, label);
                }

                CustomEventEmitter.dispatch(SET_DETAIL_REGIONS_EVENT, {});
            });
        });
    }
}
