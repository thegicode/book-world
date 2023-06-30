import { CustomEventEmitter } from "../../utils/index";
import { getState, addRegion, addDetailRegion, removeDetailRegion, } from "../../modules/model";
const FETCH_REGION_DATA_EVENT = "fetch-region-data";
const SET_FAVORITE_REGIONS_EVENT = "set-favorite-regions";
const SET_DETAIL_REGIONS_EVENT = "set-detail-regions";
export default class SetDetailRegion extends HTMLElement {
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
        CustomEventEmitter.remove(SET_FAVORITE_REGIONS_EVENT, this.renderRegion);
    }
    // selectElement, selectElements : 몇 개만 해보고 좀 더 고민해보기로. 바꾸는게 의미가 있는지 모르겠다.
    selectElement(selector, scope) {
        if (scope === "component") {
            return this.querySelector(selector);
        }
        else {
            return document.querySelector(selector);
        }
    }
    selectElements(selector, scope) {
        if (scope === "component") {
            return this.querySelectorAll(selector);
        }
        else {
            return document.querySelectorAll(selector);
        }
    }
    setRegionData(event) {
        const customEvent = event;
        this.regionData = customEvent.detail.regionData;
        this.renderRegion();
    }
    renderRegion() {
        const favoriteRegions = Object.keys(getState().regions);
        if (favoriteRegions.length < 1)
            return;
        const container = this.selectElement(".regions", "component");
        if (!container)
            return;
        container.innerHTML = "";
        const regionElements = this.createRegions(favoriteRegions);
        if (!regionElements)
            return;
        container.appendChild(regionElements);
        this.initializeFirstRegion(container);
    }
    createRegions(favoriteRegions) {
        var _a;
        const template = (_a = this.selectElement("#tp-favorite-region")) === null || _a === void 0 ? void 0 : _a.content.firstElementChild;
        if (!template)
            return;
        const fragment = new DocumentFragment();
        favoriteRegions.forEach((region) => {
            const element = template.cloneNode(true);
            const spanElement = element.querySelector("span");
            if (!spanElement)
                return null;
            if (spanElement)
                spanElement.textContent = region;
            fragment.appendChild(element);
        });
        return fragment;
    }
    initializeFirstRegion(container) {
        const firstInput = container.querySelector("input");
        if (firstInput) {
            firstInput.checked = true;
            const label = firstInput.nextElementSibling.textContent ||
                "";
            this.renderDetailRegions(label);
            this.changeRegion();
        }
    }
    renderDetailRegions(regionName) {
        var _a;
        if (!this.regionData)
            return;
        const detailRegionsElement = this.querySelector(".detailRegions");
        if (!detailRegionsElement)
            return;
        const regionObj = getState().regions[regionName];
        const regionCodes = regionObj ? Object.values(regionObj) : [];
        const template = (_a = this.selectElement("#tp-detail-region")) === null || _a === void 0 ? void 0 : _a.content.firstElementChild;
        if (!template)
            return;
        detailRegionsElement.innerHTML = "";
        const detailRegionData = this.regionData.detailRegion[regionName];
        if (!detailRegionData)
            return;
        const fragment = this.createDetailRegionElements(detailRegionData, template, regionCodes);
        detailRegionsElement.appendChild(fragment);
        this.region = regionName;
        this.onChangeDetail();
    }
    createDetailRegionElements(detailRegionData, template, regionCodes) {
        const fragment = new DocumentFragment();
        for (const [key, value] of Object.entries(detailRegionData)) {
            const element = template.cloneNode(true);
            const spanElement = element.querySelector("span");
            if (spanElement)
                spanElement.textContent = key;
            const input = element.querySelector("input");
            if (input) {
                input.value = value;
                if (regionCodes.includes(value)) {
                    input.checked = true;
                    fragment.insertBefore(element, fragment.firstChild);
                }
                else {
                    fragment.appendChild(element);
                }
            }
        }
        return fragment;
    }
    changeRegion() {
        const regionRadios = this.querySelectorAll("[name=favorite-region]");
        Array.from(regionRadios).forEach((radio) => {
            const inputRadio = radio;
            inputRadio.addEventListener("change", () => {
                if (inputRadio.checked) {
                    const label = inputRadio.nextElementSibling
                        .textContent || "";
                    this.renderDetailRegions(label);
                }
            });
        });
    }
    onChangeDetail() {
        const region = this.region;
        if (!getState().regions[region]) {
            addRegion(region);
        }
        const checkboxes = this.selectElements("[name=detailRegion]");
        checkboxes.forEach((checkbox) => {
            const inputCheckbox = checkbox;
            inputCheckbox.addEventListener("change", () => {
                const { value } = inputCheckbox;
                const label = inputCheckbox.nextElementSibling
                    .textContent || "";
                if (inputCheckbox.checked) {
                    addDetailRegion(region, label, value);
                }
                else {
                    removeDetailRegion(region, label);
                }
                CustomEventEmitter.dispatch(SET_DETAIL_REGIONS_EVENT, {});
            });
        });
    }
}
//# sourceMappingURL=SetDetailRegion.js.map