import { cloneTemplate } from "../../utils/helpers";
import bookStore from "../../modules/BookStore";
import { libraryElement } from "./constant";

export default class LibraryRegion extends HTMLElement {
    private regionCode: string | null;
    private detailElement!: HTMLSelectElement;

    constructor() {
        super();
        this.regionCode = null;
    }

    connectedCallback() {
        this.detailElement = this.querySelector("select") as HTMLSelectElement;

        this.renderRegion();
    }

    // disconnectedCallback() {}

    private renderRegion() {
        const favoriteRegions = bookStore.regions;

        if (Object.keys(favoriteRegions).length === 0) return;

        const container = this.querySelector(".region") as HTMLElement;
        const fragment = this.createRegionElement(favoriteRegions);
        container.appendChild(fragment);

        if (!this.regionCode) {
            const firstInput = container.querySelector(
                "input"
            ) as HTMLInputElement;
            firstInput.checked = true;
            this.renderDetailRegion(firstInput.value);
        }
    }

    private createRegionElement(favoriteRegions: IDetailRegionData) {
        const template = document.querySelector(
            "#tp-region"
        ) as HTMLTemplateElement;

        const fragment = new DocumentFragment();
        for (const regionName of Object.keys(favoriteRegions)) {
            const size = Object.keys(favoriteRegions[regionName]).length;
            if (template && size > 0) {
                const element = cloneTemplate(template);
                const radioElement =
                    element.querySelector<HTMLInputElement>("input");
                if (radioElement) radioElement.value = regionName;

                radioElement?.addEventListener("change", () => {
                    this.regionCode = radioElement.value;
                    this.renderDetailRegion(radioElement.value);
                });

                const spanElement = element.querySelector("span");
                if (spanElement) spanElement.textContent = regionName;
                fragment.appendChild(element);
            }
        }
        return fragment;
    }

    private renderDetailRegion(regionName: string) {
        this.detailElement.innerHTML = "";

        const detailRegionObject = bookStore.regions[regionName];
        for (const [key, value] of Object.entries(detailRegionObject)) {
            const optionEl = document.createElement("option");
            optionEl.textContent = key;
            optionEl.value = value;
            this.detailElement.appendChild(optionEl);
        }
        const firstOptionElement = this.detailElement.querySelector(
            "option"
        ) as HTMLOptionElement;
        firstOptionElement.selected = true;
        this.alertDetailCode();

        this.detailElement.addEventListener("change", this.alertDetailCode);
    }

    private alertDetailCode = () => {
        const { value } = this.detailElement;
        console.log("detailCdoe", value);

        if (libraryElement) libraryElement.regionCode = value;
    };
}
