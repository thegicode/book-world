import bookModel, { BookModelEvent } from "@/model";
import { cloneTemplate } from "@/utils/helpers";

export default class LibrarySearchStored extends HTMLElement {
    private template: HTMLTemplateElement | null = null;
    private listElement: HTMLElement | null = null;

    constructor() {
        super();

        this.subscribeUpdate = this.subscribeUpdate.bind(this);
    }

    connectedCallback() {
        this.template = this.querySelector("#tp-stored-item");
        this.listElement = this.querySelector("ul");

        if (!this.listElement) return;

        this.render();
        bookModel.subscribe(BookModelEvent.LibraryUpdate, this.subscribeUpdate);
    }

    disconnectedCallback() {
        bookModel.unsubscribe(
            BookModelEvent.LibraryUpdate,
            this.subscribeUpdate
        );
    }

    private render() {
        if (!this.listElement) return;
        this.listElement.innerHTML = "";

        const libraries = bookModel.libraries;

        const fragment = new DocumentFragment();
        for (const [code, data] of Object.entries(libraries)) {
            const libName = typeof data === "string" ? data : data.libName;
            const element = this.createElement(code, libName);
            if (!element) return;
            fragment.appendChild(element);
        }

        this.listElement.appendChild(fragment);
    }

    private createElement(code: string, name: string): HTMLElement | void {
        if (!this.template) return;

        const template = cloneTemplate(this.template);
        const nameElement = template.querySelector(".name") as HTMLAnchorElement;
        nameElement.textContent = name;
        nameElement.href = `/library?libCode=${code}`;

        template.dataset.library = code;

        this.addEvents(template);
        return template;
    }

    private addEvents(element: HTMLElement) {
        const cancelButton = element.querySelector(
            ".cancelButton",
        ) as HTMLButtonElement;

        cancelButton.addEventListener("click", () => {
            const code = element.dataset.library;
            if (!code) return;
            bookModel.removeLibraries(code);
        });
    }

    private subscribeUpdate(update?: TLibraryUpdateProps) {
        if (!update) return;
        const { type, payload } = update;

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

    private add({ code, data }: TLibraryPayload) {
        if (!this.listElement || !data) return;
        const libName = typeof data === "string" ? data : data.libName;
        const element = this.createElement(code, libName) as HTMLElement;
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
