export default class BookImage extends HTMLElement {
    constructor(url, name) {
        super();
        this.image = null;
        this.render(url, name);
    }
    // connectedCallback() {}
    render(url, name) {
        const imagge = document.createElement("img");
        imagge.className = "thumb";
        imagge.src = url;
        imagge.alt = name;
        imagge.onerror = this.onError.bind(this);
        this.image = imagge;
        this.appendChild(imagge);
    }
    onError() {
        var _a;
        this.dataset.fail = "true";
        console.error(`Failed to load image`);
        (_a = this.image) === null || _a === void 0 ? void 0 : _a.remove();
    }
}
//# sourceMappingURL=BookImage.js.map