import { CustomEventEmitter, CustomFetch } from "../../utils/index";
import { cloneTemplate } from "../../utils/helpers";
import { FETCH_REGION_DATA_EVENT } from "./constants";
import bookStore2 from "../../modules/BookStore2";

export default class SetRegion extends HTMLElement {
    private regionData: TotalRegions | null;
    private template: HTMLTemplateElement;

    constructor() {
        super();
        this.regionData = null;
        this.template = document.querySelector(
            "#tp-region"
        ) as HTMLTemplateElement;

        this.fetchAndRender = this.fetchAndRender.bind(this);
    }

    connectedCallback() {
        this.fetchAndRender();

        bookStore2.subscribeToBookStateUpdate(this.fetchAndRender);
        // publishers.bookStateUpdate.subscribe(this.fetchAndRender);
    }

    discinnectedCallback() {
        bookStore2.unsubscribeToBookStateUpdate(this.fetchAndRender);
        // publishers.bookStateUpdate.unsubscribe(this.fetchAndRender);
    }

    private async fetchAndRender() {
        try {
            this.regionData = (await await CustomFetch.fetch(
                "../../../assets/json/region.json"
            )) as TotalRegions;

            this.render();

            CustomEventEmitter.dispatch(FETCH_REGION_DATA_EVENT, {
                regionData: this.regionData,
            });
        } catch (error) {
            console.error(error);
            throw new Error("Fail to get region data.");
        }
    }

    private render() {
        const regionElementsFragment = this.createRegionElementsFragment();

        const container = this.querySelector(".regions") as HTMLElement;
        container.innerHTML = "";
        container.appendChild(regionElementsFragment);
    }

    private createRegionElementsFragment() {
        if (!this.regionData) {
            throw new Error("regionData is null.");
        }

        const fragment = new DocumentFragment();

        const regionData = this.regionData["region"];
        const favoriteRegions = Object.keys(bookStore2.getRegions());

        for (const [key, value] of Object.entries(regionData)) {
            const regionElement = this.createRegionElement(
                this.template,
                key,
                value,
                favoriteRegions
            );
            fragment.appendChild(regionElement);
        }

        return fragment;
    }

    private createRegionElement(
        template: HTMLTemplateElement,
        key: string,
        value: string,
        favoriteRegions: string[]
    ) {
        const regionElement = cloneTemplate(template);
        const checkbox = regionElement.querySelector(
            "input"
        ) as HTMLInputElement;
        checkbox.value = value;
        checkbox.checked = favoriteRegions.includes(key);
        checkbox.addEventListener(
            "change",
            this.createCheckboxChangeListener(checkbox)
        );

        const spanElement = regionElement.querySelector("span");
        if (spanElement) spanElement.textContent = key;

        return regionElement;
    }

    private createCheckboxChangeListener(checkbox: HTMLInputElement) {
        return () => {
            const spanElement = checkbox.nextElementSibling as HTMLElement;
            if (!spanElement || typeof spanElement.textContent !== "string") {
                throw new Error(
                    "Invalid checkbox element: No sibling element or missing text content."
                );
            }

            const key = spanElement.textContent;

            if (checkbox.checked) {
                bookStore2.addRegion(key);
            } else {
                bookStore2.removeRegion(key);
            }
        };
    }
}
