import { cloneTemplate } from "../../utils/helpers";
import { libraryElement } from "./selectors";
import bookStore2 from "../../modules/BookStore2";

export default class LibraryRegion extends HTMLElement {
    private regionCode: string | null = null;
    private template: HTMLTemplateElement | null = null;
    private detailSelectElement!: HTMLSelectElement;

    constructor() {
        super();
    }

    connectedCallback() {
        this.template = document.querySelector(
            "#tp-region"
        ) as HTMLTemplateElement;
        this.detailSelectElement = this.querySelector(
            "select"
        ) as HTMLSelectElement;

        this.renderFavoriteRegions();

        this.detailSelectElement.addEventListener(
            "change",
            this.handleDetailSelectChange
        );
    }

    disconnectedCallback() {
        this.detailSelectElement.removeEventListener(
            "change",
            this.handleDetailSelectChange
        );
    }

    private renderFavoriteRegions() {
        const favoriteRegions = bookStore2.getRegions();

        if (Object.keys(favoriteRegions).length === 0) return;

        const container = this.querySelector(".region") as HTMLElement;
        const fragment = new DocumentFragment();
        for (const regionName of Object.keys(favoriteRegions)) {
            const size = Object.keys(favoriteRegions[regionName]).length;
            if (this.template && size > 0) {
                const element = this.createElement(regionName) as HTMLElement;
                fragment.appendChild(element);
            }
        }

        container.appendChild(fragment);

        if (!this.regionCode) {
            const firstInput = container.querySelector(
                "input"
            ) as HTMLInputElement;
            firstInput.checked = true;
            this.renderDetailRegion(firstInput.value);
        }
    }

    private createElement(regionName: string) {
        if (!this.template) return;

        const element = cloneTemplate(this.template);
        const radioElement = element.querySelector("input") as HTMLInputElement;

        radioElement.value = regionName;
        radioElement.addEventListener("change", () =>
            this.handleRegionChange(radioElement.value)
        );

        const spanElement = element.querySelector("span") as HTMLSpanElement;
        spanElement.textContent = regionName;

        return element;
    }

    private handleRegionChange(regionCode: string) {
        this.regionCode = regionCode;
        this.renderDetailRegion(regionCode);
    }

    private renderDetailRegion(regionName: string) {
        this.detailSelectElement.innerHTML = "";

        const detailRegionObject = bookStore2.getRegions()[regionName];
        for (const [key, value] of Object.entries(detailRegionObject)) {
            const optionEl = document.createElement("option");
            optionEl.textContent = key;
            optionEl.value = value;
            this.detailSelectElement.appendChild(optionEl);
        }
        const firstOptionElement = this.detailSelectElement.querySelector(
            "option"
        ) as HTMLOptionElement;
        firstOptionElement.selected = true;

        this.handleDetailSelectChange();
    }

    private handleDetailSelectChange = () => {
        const { value } = this.detailSelectElement;

        if (libraryElement) libraryElement.regionCode = value;
    };
}
