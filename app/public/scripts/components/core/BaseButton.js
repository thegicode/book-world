"use strict";
class BaseButton extends HTMLButtonElement {
    constructor() {
        var _a;
        super();
        this.handleClick = (_a = this.handleClick) === null || _a === void 0 ? void 0 : _a.bind(this);
    }
    connectedCallback() {
        this.addEventListener("click", this.handleClick);
    }
    disconnectedCallback() {
        this.removeEventListener("click", this.handleClick);
    }
    handleClick() {
        console.log("handleClick");
    }
}
customElements.define("base-button", BaseButton);
//# sourceMappingURL=BaseButton.js.map