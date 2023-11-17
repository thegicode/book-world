import { CustomEventEmitter } from "../../utils/index";
import bookStore from "../../modules/BookStore";
const DETAIL_REGIONS_EVENT = "set-detail-regions";
const SET_FAVORITE_REGIONS_EVENT = "set-favorite-regions";
export default class FavoriteRegions extends HTMLElement {
    constructor() {
        super();
        this.container = null;
        this.render = this.render.bind(this);
    }
    connectedCallback() {
        this.container = this.querySelector(".favorites");
        this.render();
        CustomEventEmitter.add(SET_FAVORITE_REGIONS_EVENT, this.render);
        CustomEventEmitter.add(DETAIL_REGIONS_EVENT, this.render);
    }
    disconnectedCallback() {
        CustomEventEmitter.remove(SET_FAVORITE_REGIONS_EVENT, this.render);
        CustomEventEmitter.remove(DETAIL_REGIONS_EVENT, this.render);
    }
    render() {
        if (!this.container)
            return;
        this.container.innerHTML = "";
        const { regions } = bookStore;
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
    renderDetail(detailRegions) {
        if (!this.container)
            return;
        const fragment = new DocumentFragment();
        detailRegions.forEach((name) => {
            const element = document.createElement("p");
            element.textContent = name;
            fragment.appendChild(element);
        });
        this.container.appendChild(fragment);
    }
}
//# sourceMappingURL=FavoriteRegions.js.map