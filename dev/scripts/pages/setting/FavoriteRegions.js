import bookModel from "../../model";
import { cloneTemplate } from "../../utils/helpers";
export default class FavoriteRegions extends HTMLElement {
    constructor() {
        super();
        this.container = null;
        this.template = null;
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
    render() {
        if (!this.container)
            return;
        this.container.innerHTML = "";
        const regions = bookModel.getRegions();
        const fragment = new DocumentFragment();
        for (const [name, detailRegions] of Object.entries(regions)) {
            const itemElement = this.createElement(name, detailRegions);
            fragment.appendChild(itemElement);
        }
        this.container.appendChild(fragment);
    }
    createElement(name, detailRegions) {
        var _a;
        if (!this.template)
            return;
        const itemElement = cloneTemplate(this.template);
        const titleElement = itemElement.querySelector(".subTitle");
        titleElement.textContent = name;
        const regions = this.renderDetail(detailRegions);
        (_a = itemElement.querySelector(".regions")) === null || _a === void 0 ? void 0 : _a.appendChild(regions);
        return itemElement;
    }
    renderDetail(detailRegions) {
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
//# sourceMappingURL=FavoriteRegions.js.map