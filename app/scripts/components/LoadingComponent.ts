export default class loadingComponent extends HTMLElement {
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
