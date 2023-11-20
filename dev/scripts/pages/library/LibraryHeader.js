import { cloneTemplate } from "../../utils/helpers";
import bookStore from "../../modules/BookStore";
import { libraryElement } from "./constant";
export default class LibraryRegion extends HTMLElement {
    constructor() {
        super();
        this.alertDetailCode = () => {
            const { value } = this.detailElement;
            console.log("detailCdoe", value);
            if (libraryElement)
                libraryElement.regionCode = value;
        };
        this.regionCode = null;
    }
    connectedCallback() {
        this.detailElement = this.querySelector("select");
        this.renderRegion();
    }
    // disconnectedCallback() {}
    renderRegion() {
        const favoriteRegions = bookStore.regions;
        if (Object.keys(favoriteRegions).length === 0)
            return;
        const container = this.querySelector(".region");
        const fragment = this.createRegionElement(favoriteRegions);
        container.appendChild(fragment);
        if (!this.regionCode) {
            const firstInput = container.querySelector("input");
            firstInput.checked = true;
            this.renderDetailRegion(firstInput.value);
        }
    }
    createRegionElement(favoriteRegions) {
        const template = document.querySelector("#tp-region");
        const fragment = new DocumentFragment();
        for (const regionName of Object.keys(favoriteRegions)) {
            const size = Object.keys(favoriteRegions[regionName]).length;
            if (template && size > 0) {
                const element = cloneTemplate(template);
                const radioElement = element.querySelector("input");
                if (radioElement)
                    radioElement.value = regionName;
                radioElement === null || radioElement === void 0 ? void 0 : radioElement.addEventListener("change", () => {
                    this.regionCode = radioElement.value;
                    this.renderDetailRegion(radioElement.value);
                });
                const spanElement = element.querySelector("span");
                if (spanElement)
                    spanElement.textContent = regionName;
                fragment.appendChild(element);
            }
        }
        return fragment;
    }
    renderDetailRegion(regionName) {
        this.detailElement.innerHTML = "";
        const detailRegionObject = bookStore.regions[regionName];
        for (const [key, value] of Object.entries(detailRegionObject)) {
            const optionEl = document.createElement("option");
            optionEl.textContent = key;
            optionEl.value = value;
            this.detailElement.appendChild(optionEl);
        }
        const firstOptionElement = this.detailElement.querySelector("option");
        firstOptionElement.selected = true;
        this.alertDetailCode();
        this.detailElement.addEventListener("change", this.alertDetailCode);
    }
}
//# sourceMappingURL=LibraryHeader.js.map