import { CustomEventEmitter } from "../../utils/index";
import { getState } from "../../modules/model";
export default class LibraryRegion extends HTMLElement {
    constructor() {
        super();
        this.onChangeDetail = () => {
            const { value } = this.selectElement;
            CustomEventEmitter.dispatch("set-detail-region", {
                detailRegionCode: value,
            });
        };
        // this.onChangeDetail = this.onChangeDetail.bind(this);
    }
    connectedCallback() {
        this.selectElement = this.querySelector("select");
        this.renderRegion();
        this.selectElement.addEventListener("change", this.onChangeDetail);
    }
    disconnectedCallback() {
        this.selectElement.removeEventListener("change", this.onChangeDetail);
    }
    renderRegion() {
        const favoriteRegions = getState().regions;
        if (Object.keys(favoriteRegions).length === 0)
            return;
        const container = this.querySelector(".region");
        const fragment = this.getRegionElements(favoriteRegions);
        container.appendChild(fragment);
        const firstInput = container.querySelector("input");
        firstInput.checked = true;
        this.renderDetailRegion(firstInput.value);
        this.changeRegion();
    }
    getRegionElements(favoriteRegions) {
        const template = document.querySelector("#tp-region").content.firstElementChild;
        const fragment = new DocumentFragment();
        for (const regionName of Object.keys(favoriteRegions)) {
            const size = Object.keys(favoriteRegions[regionName]).length;
            if (template && size > 0) {
                const element = template.cloneNode(true);
                const inputElement = element.querySelector("input");
                if (inputElement)
                    inputElement.value = regionName;
                const spanElement = element.querySelector("span");
                if (spanElement)
                    spanElement.textContent = regionName;
                fragment.appendChild(element);
            }
        }
        return fragment;
    }
    changeRegion() {
        const regionRadios = this.querySelectorAll("[name=region]");
        regionRadios.forEach((radio) => {
            radio.addEventListener("change", () => {
                if (radio.checked) {
                    const value = radio.value;
                    this.renderDetailRegion(value);
                }
            });
        });
    }
    renderDetailRegion(regionName) {
        this.selectElement.innerHTML = "";
        const detailRegionObject = getState().regions[regionName];
        for (const [key, value] of Object.entries(detailRegionObject)) {
            const optionEl = document.createElement("option");
            optionEl.textContent = key;
            optionEl.value = value;
            this.selectElement.appendChild(optionEl);
        }
        const firstInput = this.selectElement.querySelector("option");
        firstInput.selected = true;
        this.onChangeDetail();
    }
}
//# sourceMappingURL=LibraryRegion.js.map