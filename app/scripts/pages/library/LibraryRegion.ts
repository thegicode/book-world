import { CustomEventEmitter } from "../../utils/index";
import { getState } from "../../modules/model";
import { cloneTemplate } from "../../utils/helpers";

export default class LibraryRegion extends HTMLElement {
    private selectElement!: HTMLSelectElement;

    constructor() {
        super();
    }

    connectedCallback() {
        this.selectElement = this.querySelector("select") as HTMLSelectElement;

        this.renderRegion();
        this.selectElement.addEventListener("change", this.onChangeDetail);
    }

    disconnectedCallback() {
        this.selectElement.removeEventListener("change", this.onChangeDetail);
    }

    private renderRegion() {
        const favoriteRegions = getState().regions;

        if (Object.keys(favoriteRegions).length === 0) return;

        const container = this.querySelector(".region") as HTMLElement;
        const fragment = this.getRegionElements(favoriteRegions);
        container.appendChild(fragment);

        const firstInput = container.querySelector("input") as HTMLInputElement;
        firstInput.checked = true;

        this.renderDetailRegion(firstInput.value);
        this.changeRegion();
    }

    private getRegionElements(favoriteRegions: IDetailRegionData) {
        const template = document.querySelector(
            "#tp-region"
        ) as HTMLTemplateElement;

        const fragment = new DocumentFragment();
        for (const regionName of Object.keys(favoriteRegions)) {
            const size = Object.keys(favoriteRegions[regionName]).length;
            if (template && size > 0) {
                const element = cloneTemplate(template);
                const inputElement =
                    element.querySelector<HTMLInputElement>("input");
                if (inputElement) inputElement.value = regionName;
                const spanElement = element.querySelector("span");
                if (spanElement) spanElement.textContent = regionName;
                fragment.appendChild(element);
            }
        }
        return fragment;
    }

    private changeRegion() {
        const regionRadios =
            this.querySelectorAll<HTMLInputElement>("[name=region]");
        regionRadios.forEach((radio) => {
            radio.addEventListener("change", () => {
                if (radio.checked) {
                    const value = radio.value;
                    this.renderDetailRegion(value);
                }
            });
        });
    }

    private renderDetailRegion(regionName: string) {
        this.selectElement.innerHTML = "";
        const detailRegionObject = getState().regions[regionName];
        for (const [key, value] of Object.entries(detailRegionObject)) {
            const optionEl = document.createElement("option");
            optionEl.textContent = key;
            optionEl.value = value;
            this.selectElement.appendChild(optionEl);
        }
        const firstInput = this.selectElement.querySelector(
            "option"
        ) as HTMLOptionElement;
        firstInput.selected = true;
        this.onChangeDetail();
    }

    private onChangeDetail = () => {
        const { value } = this.selectElement;
        CustomEventEmitter.dispatch("set-detail-region", {
            detailRegionCode: value,
        });
    };
}
