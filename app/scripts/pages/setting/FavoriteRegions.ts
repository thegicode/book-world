import bookModel from "../../model";

export default class FavoriteRegions extends HTMLElement {
    private container: HTMLElement | null = null;

    constructor() {
        super();
        this.render = this.render.bind(this);
    }

    connectedCallback() {
        this.container = this.querySelector(".favorites") as HTMLElement;
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
        for (const regionName in regions) {
            const detailRegions = Object.keys(regions[regionName]);
            if (detailRegions.length > 0) {
                const titleElement = document.createElement("h3");
                titleElement.textContent = regionName;
                this.container.appendChild(titleElement);
                this.container.appendChild(this.renderDetail(detailRegions));
            }
        }
    }

    private renderDetail(detailRegions: string[]) {
        const fragment = new DocumentFragment();
        detailRegions.forEach((name) => {
            const element = document.createElement("span");
            element.textContent = name;
            fragment.appendChild(element);
        });

        const container = document.createElement("div");
        container.className = "favorites-item";
        container.appendChild(fragment);
        return container;
    }
}
