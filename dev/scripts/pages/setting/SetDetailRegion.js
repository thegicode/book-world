import { CustomEventEmitter } from "../../utils/index";
import { cloneTemplate } from "../../utils/helpers";
import { FETCH_REGION_DATA_EVENT } from "./constants";
import bookModel from "../../model";
export default class SetDetailRegion extends HTMLElement {
    constructor() {
        super();
        this.regionData = null;
        this.region = "";
        this.setRegionData = this.setRegionData.bind(this);
        this.renderRegion = this.renderRegion.bind(this);
    }
    connectedCallback() {
        bookModel.subscribeToRegionUpdate(this.renderRegion);
        CustomEventEmitter.add(FETCH_REGION_DATA_EVENT, this.setRegionData);
    }
    disconnectedCallback() {
        bookModel.unsubscribeToRegionUpdate(this.renderRegion);
        CustomEventEmitter.remove(FETCH_REGION_DATA_EVENT, this.setRegionData);
    }
    setRegionData(event) {
        const customEvent = event;
        this.regionData = customEvent.detail.regionData;
        this.renderRegion();
    }
    renderRegion() {
        const favoriteRegions = Object.keys(bookModel.getRegions());
        const container = this.querySelector(".regions");
        if (!container)
            return;
        container.innerHTML = "";
        if (favoriteRegions.length > 0) {
            const regionElements = this.createRegions(favoriteRegions);
            container.appendChild(regionElements);
        }
        this.initializeFirstRegion(container);
    }
    createRegions(favoriteRegions) {
        const template = document.querySelector("#tp-favorite-region");
        const fragment = new DocumentFragment();
        favoriteRegions.forEach((region) => {
            if (region === "")
                return null;
            const element = cloneTemplate(template);
            const spanElement = element.querySelector("span");
            if (spanElement)
                spanElement.textContent = region;
            fragment.appendChild(element);
        });
        return fragment;
    }
    initializeFirstRegion(container) {
        const firstInput = container.querySelector("input");
        if (!firstInput) {
            this.renderDetailRegions("");
            return;
        }
        firstInput.checked = true;
        const labelEl = firstInput.nextElementSibling;
        const label = (labelEl === null || labelEl === void 0 ? void 0 : labelEl.textContent) || "";
        this.renderDetailRegions(label);
        this.changeRegion();
    }
    renderDetailRegions(regionName) {
        var _a;
        const detailRegionsElement = this.querySelector(".detailRegions");
        if (!detailRegionsElement)
            return;
        const regionObj = bookModel.getRegions()[regionName];
        const regionCodes = regionObj ? Object.values(regionObj) : [];
        const template = document.querySelector("#tp-detail-region");
        if (!template)
            return;
        detailRegionsElement.innerHTML = "";
        const detailRegionData = ((_a = this.regionData) === null || _a === void 0 ? void 0 : _a.detailRegion[regionName]) || {};
        const fragment = this.createDetailRegionElements(detailRegionData, template, regionCodes);
        detailRegionsElement.appendChild(fragment);
        this.region = regionName;
        this.onChangeDetail();
    }
    createDetailRegionElements(detailRegionData, template, regionCodes) {
        const fragment = new DocumentFragment();
        for (const [key, value] of Object.entries(detailRegionData)) {
            const element = cloneTemplate(template);
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
                    const labelElement = inputRadio.nextElementSibling;
                    const label = (labelElement === null || labelElement === void 0 ? void 0 : labelElement.textContent) || "";
                    this.renderDetailRegions(label);
                }
            });
        });
    }
    onChangeDetail() {
        const region = this.region;
        if (!bookModel.getRegions()[region]) {
            bookModel.addRegion(region);
        }
        const checkboxes = document.querySelectorAll("[name=detailRegion]");
        checkboxes.forEach((checkbox) => {
            const inputCheckbox = checkbox;
            inputCheckbox.addEventListener("change", () => {
                const { value } = inputCheckbox;
                const labelElement = inputCheckbox.nextElementSibling;
                const label = (labelElement === null || labelElement === void 0 ? void 0 : labelElement.textContent) || "";
                if (inputCheckbox.checked) {
                    bookModel.addDetailRegion(region, label, value);
                }
                else {
                    bookModel.removeDetailRegion(region, label);
                }
            });
        });
    }
}
//# sourceMappingURL=SetDetailRegion.js.map