import { cloneTemplate } from "../../utils/helpers";
import { libraryElement } from "./selectors";
import bookModel from "../../model";
export default class LibraryRegion extends HTMLElement {
    constructor() {
        super();
        this.regionCode = null;
        this.template = null;
        this.handleDetailSelectChange = () => {
            const { value } = this.detailSelectElement;
            if (libraryElement)
                libraryElement.regionCode = value;
        };
    }
    connectedCallback() {
        this.template = document.querySelector("#tp-region");
        this.detailSelectElement = this.querySelector("select");
        this.renderFavoriteRegions();
        this.detailSelectElement.addEventListener("change", this.handleDetailSelectChange);
    }
    disconnectedCallback() {
        this.detailSelectElement.removeEventListener("change", this.handleDetailSelectChange);
    }
    renderFavoriteRegions() {
        const favoriteRegions = bookModel.getRegions();
        if (Object.keys(favoriteRegions).length === 0)
            return;
        const container = this.querySelector(".region");
        const fragment = new DocumentFragment();
        for (const regionName of Object.keys(favoriteRegions)) {
            const size = Object.keys(favoriteRegions[regionName]).length;
            if (this.template && size > 0) {
                const element = this.createElement(regionName);
                fragment.appendChild(element);
            }
        }
        container.appendChild(fragment);
        if (!this.regionCode) {
            const firstInput = container.querySelector("input");
            firstInput.checked = true;
            this.renderDetailRegion(firstInput.value);
        }
    }
    createElement(regionName) {
        if (!this.template)
            return;
        const element = cloneTemplate(this.template);
        const radioElement = element.querySelector("input");
        radioElement.value = regionName;
        radioElement.addEventListener("change", () => this.handleRegionChange(radioElement.value));
        const spanElement = element.querySelector("span");
        spanElement.textContent = regionName;
        return element;
    }
    handleRegionChange(regionCode) {
        this.regionCode = regionCode;
        this.renderDetailRegion(regionCode);
    }
    renderDetailRegion(regionName) {
        this.detailSelectElement.innerHTML = "";
        const detailRegionObject = bookModel.getRegions()[regionName];
        for (const [key, value] of Object.entries(detailRegionObject)) {
            const optionEl = document.createElement("option");
            optionEl.textContent = key;
            optionEl.value = value;
            this.detailSelectElement.appendChild(optionEl);
        }
        const firstOptionElement = this.detailSelectElement.querySelector("option");
        firstOptionElement.selected = true;
        this.handleDetailSelectChange();
    }
}
//# sourceMappingURL=LibraryHeader.js.map