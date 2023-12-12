import bookModel from "../../model";
import { cloneTemplate } from "../../utils/helpers";

export default class FavoriteRegions extends HTMLElement {
    private container: HTMLElement | null = null;
    private template: HTMLTemplateElement | null = null;

    constructor() {
        super();
        this.render = this.render.bind(this);
    }

    connectedCallback() {
        this.container = this.querySelector(".favorites");
        this.template = this.querySelector("#tp-favorites-stored");

        this.render();

        bookModel.subscribeToBookStateUpdate(this.render);
        bookModel.subscribeToDetailRegionUpdate(this.render);
    }

    disconnectedCallback() {
        bookModel.unsubscribeToBookStateUpdate(this.render);
        bookModel.unsubscribeToDetailRegionUpdate(this.render);
    }

    private render() {
        if (!this.container) return;

        this.container.innerHTML = "";
        const regions = bookModel.getRegions();

        const fragment = new DocumentFragment();
        for (const [name, detailRegions] of Object.entries(regions)) {
            const itemElement = this.createElement(
                name,
                detailRegions
            ) as HTMLElement;
            fragment.appendChild(itemElement);
        }
        this.container.appendChild(fragment);
    }

    private createElement(name: string, detailRegions: IRegionData) {
        if (!this.template) return;
        const itemElement = cloneTemplate(this.template);
        const titleElement = itemElement.querySelector(
            ".subTitle"
        ) as HTMLElement;
        titleElement.textContent = name;
        const regions = this.renderDetail(detailRegions);
        itemElement.querySelector(".regions")?.appendChild(regions);
        return itemElement;
    }

    private renderDetail(detailRegions: IRegionData) {
        const fragment = new DocumentFragment();
        for (const [region, code] of Object.entries(detailRegions)) {
            const element = document.createElement("span");
            element.textContent = region;
            element.dataset.code = code;
            fragment.appendChild(element);
        }
        return fragment;
    }
}
