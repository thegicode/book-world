var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CustomEventEmitter, CustomFetch } from "../../utils/index.js";
import { getState, addRegion, removeRegion } from "../../modules/model.js";
export default class SetRegion extends HTMLElement {
    constructor() {
        super();
        this.regionData = null;
    }
    connectedCallback() {
        this.fetchRegion();
    }
    fetchRegion() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = "../../json/region.json";
            try {
                this.regionData = (yield CustomFetch.fetch(url));
                this.render();
                CustomEventEmitter.dispatch("fetch-region-data", {
                    regionData: this.regionData,
                });
            }
            catch (error) {
                console.error(error);
                throw new Error("Fail to get region data.");
            }
        });
    }
    render() {
        if (!this.regionData) {
            throw new Error("regionData is null.");
        }
        const template = document.querySelector("#tp-region").content.firstElementChild;
        const container = this.querySelector(".regions");
        const regionData = this.regionData["region"];
        const fragment = new DocumentFragment();
        const stateRegions = Object.keys(getState().regions);
        for (const [key, value] of Object.entries(regionData)) {
            if (!template)
                return;
            const element = template.cloneNode(true);
            const checkbox = element.querySelector("input");
            checkbox.value = value;
            if (stateRegions.includes(key)) {
                checkbox.checked = true;
            }
            const spanElement = element.querySelector("span");
            if (spanElement)
                spanElement.textContent = key;
            fragment.appendChild(element);
        }
        container.appendChild(fragment);
        this.changeRegion();
    }
    changeRegion() {
        const checkboxes = this.querySelectorAll("[name=region]");
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener("change", () => {
                const key = checkbox.nextElementSibling.textContent ||
                    "";
                if (checkbox.checked) {
                    addRegion(key);
                }
                else {
                    removeRegion(key);
                }
                CustomEventEmitter.dispatch("set-favorite-regions", {});
            });
        });
    }
}
//# sourceMappingURL=SetRegion.js.map