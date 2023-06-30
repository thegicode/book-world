import { CustomEventEmitter } from "../../utils/index";
import {
    getState,
    addRegion,
    addDetailRegion,
    removeDetailRegion,
} from "../../modules/model";

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

    // selectElement, selectElements : 몇 개만 해보고 좀 더 고민해보기로. 바꾸는게 의미가 있는지 모르겠다.

    private selectElement<T extends Element>(
        selector: string,
        scope?: "document" | "component"
    ): T | null {
        if (scope === "component") {
            return this.querySelector(selector);
        } else {
            return document.querySelector(selector);
        }
    }

    private selectElements(
        selector: string,
        scope?: "document" | "component"
    ): NodeListOf<Element> {
        if (scope === "component") {
            return this.querySelectorAll(selector);
        } else {
            return document.querySelectorAll(selector);
        }
    }

    private setRegionData(event: Event) {
        const customEvent = event as CustomEvent<{ regionData: TotalRegions }>;
        this.regionData = customEvent.detail.regionData;
        this.renderRegion();
    }

    private renderRegion() {
        const favoriteRegions = Object.keys(getState().regions);
        if (favoriteRegions.length < 1) return;

        const fragment = new DocumentFragment();

        const template = this.selectElement<HTMLTemplateElement>(
            "#tp-favorite-region"
        )?.content.firstElementChild;

        const container = this.selectElement<HTMLElement>(
            ".regions",
            "component"
        );
        if (!container) return;

        container.innerHTML = "";
        favoriteRegions.forEach((key) => {
            if (!template) return;
            const element = template.cloneNode(true) as HTMLElement;
            const spanElement = element.querySelector<HTMLElement>("span");
            if (spanElement) spanElement.textContent = key;
            fragment.appendChild(element);
        });
        container.appendChild(fragment);

        const firstInput = container.querySelector<HTMLInputElement>("input");
        if (firstInput) {
            firstInput.checked = true;
            const label =
                (firstInput.nextElementSibling as HTMLElement).textContent ||
                "";
            this.renderDetailRegions(label);
            this.changeRegion();
        }
    }

    private renderDetailRegions(regionName: string) {
        const detailRegionsElement = this.querySelector(
            ".detailRegions"
        ) as HTMLElement;
        if (!this.regionData) return;
        const regionObj = getState().regions[regionName];
        const regionCodes = regionObj ? Object.values(regionObj) : [];

        const template =
            this.selectElement<HTMLTemplateElement>("#tp-detail-region")
                ?.content.firstElementChild;
        detailRegionsElement.innerHTML = "";
        const fragment = new DocumentFragment();

        const detailRegionData = this.regionData.detailRegion[regionName];
        if (!detailRegionData) return;
        for (const [key, value] of Object.entries(detailRegionData)) {
            if (!template) return;
            const element = template.cloneNode(true) as HTMLElement;
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
        detailRegionsElement.appendChild(fragment);
        this.region = regionName;
        this.onChangeDetail();
    }

    private changeRegion() {
        const regionRadios = this.querySelectorAll("[name=favorite-region]");
        Array.from(regionRadios).forEach((radio: Element) => {
            const inputRadio = radio as HTMLInputElement;
            inputRadio.addEventListener("change", () => {
                if (inputRadio.checked) {
                    const label =
                        (inputRadio.nextElementSibling as HTMLElement)
                            .textContent || "";
                    this.renderDetailRegions(label);
                }
            });
        });
    }

    private onChangeDetail() {
        const region = this.region;
        if (!getState().regions[region]) {
            addRegion(region);
        }
        const checkboxes = this.selectElements("[name=detailRegion]");

        checkboxes.forEach((checkbox: Element) => {
            const inputCheckbox = checkbox as HTMLInputElement;
            inputCheckbox.addEventListener("change", () => {
                const { value } = inputCheckbox;
                const label =
                    (inputCheckbox.nextElementSibling as HTMLElement)
                        .textContent || "";
                if (inputCheckbox.checked) {
                    addDetailRegion(region, label, value);
                } else {
                    removeDetailRegion(region, label);
                }
                CustomEventEmitter.dispatch(SET_DETAIL_REGIONS_EVENT, {});
            });
        });
    }
}
