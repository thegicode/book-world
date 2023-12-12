import bookModel from "../../model";
import { cloneTemplate } from "../../utils/helpers";

export default class LibraryStored extends HTMLElement {
    private template: HTMLTemplateElement | null = null;
    private listElement: HTMLElement | null = null;

    constructor() {
        super();

        this.subscribeUpdate = this.subscribeUpdate.bind(this);
    }

    connectedCallback() {
        this.template = this.querySelector("#tp-stored-item");
        console.log(this.template);
        this.listElement = this.querySelector("ul");

        if (!this.listElement) return;

        this.render();
        bookModel.subscribeLibraryUpdate(this.subscribeUpdate);
    }

    disconnectedCallback() {
        bookModel.unsubscribeLibraryUpdate(this.subscribeUpdate);
    }

    private render() {
        if (!this.listElement) return;

        const libraries = bookModel.getLibraries();

        const fragment = new DocumentFragment();
        for (const [code, name] of Object.entries(libraries)) {
            const element = this.createElement(code, name);
            if (!element) return;
            fragment.appendChild(element);
        }

        this.listElement.appendChild(fragment);
    }

    private createElement(code: string, name: string): HTMLElement | void {
        if (!this.template) return;

        const element = cloneTemplate(this.template);
        (element.querySelector(".name") as HTMLElement).textContent = name;
        element.dataset.library = code;
        this.addEvents(element);
        return element;
    }

    private addEvents(element: HTMLElement) {
        const cancelButton = element.querySelector(
            ".cancelButton"
        ) as HTMLButtonElement;

        cancelButton.addEventListener("click", () => {
            const code = element.dataset.library;
            if (!code) return;
            bookModel.removeLibraries(code);
        });
    }

    private subscribeUpdate({ type, payload }: TLibraryUpdateProps) {
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

    private add({ code, name }: TLibraryPayload) {
        if (!this.listElement || !name) return;
        const element = this.createElement(code, name) as HTMLElement;
        this.listElement.appendChild(element);
    }

    private delete(code: string) {
        if (!this.listElement) return;

        for (const element of this.listElement.querySelectorAll("li")) {
            if (element.dataset.library === code) {
                element.remove();
            }
        }
    }
}
