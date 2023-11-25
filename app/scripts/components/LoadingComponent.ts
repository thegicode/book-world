export default class LoadingComponent extends HTMLElement {
    constructor() {
        super();
    }

    show() {
        this.removeAttribute("hidden");
    }

    hide() {
        this.setAttribute("hidden", "");
    }
}

customElements.define("loading-component", LoadingComponent);
