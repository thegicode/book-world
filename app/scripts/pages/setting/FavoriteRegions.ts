import bookStore2 from "../../modules/BookStore2";

export default class FavoriteRegions extends HTMLElement {
    private container: HTMLElement | null = null;

    constructor() {
        super();
        this.render = this.render.bind(this);
    }

    connectedCallback() {
        this.container = this.querySelector(".favorites") as HTMLElement;
        this.render();

        bookStore2.subscribeToBookStateUpdate(this.render);
        bookStore2.subscribeToDetailRegionUpdate(this.render);

        // publishers.bookStateUpdate.subscribe(this.render);
        // publishers.detailRegionUpdate.subscribe(this.render);
    }

    disconnectedCallback() {
        bookStore2.unsubscribeToBookStateUpdate(this.render);
        bookStore2.unsubscribeToDetailRegionUpdate(this.render);
        // publishers.bookStateUpdate.unsubscribe(this.render);
        // publishers.detailRegionUpdate.unsubscribe(this.render);
    }

    private render() {
        if (!this.container) return;

        this.container.innerHTML = "";
        const regions = bookStore2.getRegions();
        for (const regionName in regions) {
            const detailRegions = Object.keys(regions[regionName]);
            if (detailRegions.length > 0) {
                const titleElement = document.createElement("h3");
                titleElement.textContent = regionName;
                this.container.appendChild(titleElement);
                this.renderDetail(detailRegions);
            }
        }
    }

    private renderDetail(detailRegions: string[]) {
        if (!this.container) return;

        const fragment = new DocumentFragment();
        detailRegions.forEach((name) => {
            const element = document.createElement("p");
            element.textContent = name;
            fragment.appendChild(element);
        });
        this.container.appendChild(fragment);
    }
}
