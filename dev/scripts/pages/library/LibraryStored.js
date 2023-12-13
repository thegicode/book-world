import bookModel from "../../model";
import { cloneTemplate } from "../../utils/helpers";
export default class LibraryStored extends HTMLElement {
    constructor() {
        super();
        this.template = null;
        this.listElement = null;
        this.subscribeUpdate = this.subscribeUpdate.bind(this);
    }
    connectedCallback() {
        this.template = this.querySelector("#tp-stored-item");
        console.log(this.template);
        this.listElement = this.querySelector("ul");
        if (!this.listElement)
            return;
        this.render();
        bookModel.subscribeLibraryUpdate(this.subscribeUpdate);
    }
    disconnectedCallback() {
        bookModel.unsubscribeLibraryUpdate(this.subscribeUpdate);
    }
    render() {
        if (!this.listElement)
            return;
        const libraries = bookModel.libraries;
        const fragment = new DocumentFragment();
        for (const [code, name] of Object.entries(libraries)) {
            const element = this.createElement(code, name);
            if (!element)
                return;
            fragment.appendChild(element);
        }
        this.listElement.appendChild(fragment);
    }
    createElement(code, name) {
        if (!this.template)
            return;
        const element = cloneTemplate(this.template);
        element.querySelector(".name").textContent = name;
        element.dataset.library = code;
        this.addEvents(element);
        return element;
    }
    addEvents(element) {
        const cancelButton = element.querySelector(".cancelButton");
        cancelButton.addEventListener("click", () => {
            const code = element.dataset.library;
            if (!code)
                return;
            bookModel.removeLibraries(code);
        });
    }
    subscribeUpdate({ type, payload }) {
        switch (type) {
            case "add":
                this.add(payload);
                break;
            case "delete":
                this.delete(payload.code);
                break;
            default:
                console.error("Unknown type");
        }
    }
    add({ code, name }) {
        if (!this.listElement || !name)
            return;
        const element = this.createElement(code, name);
        this.listElement.appendChild(element);
    }
    delete(code) {
        if (!this.listElement)
            return;
        for (const element of this.listElement.querySelectorAll("li")) {
            if (element.dataset.library === code) {
                element.remove();
            }
        }
    }
}
//# sourceMappingURL=LibraryStored.js.map