import { CustomFetch } from "../utils";
import { fetchAndParseTemplate } from "../utils/helpers";
import LoadingComponent from "./LoadingComponent";

export abstract class FetchListComponent<T, U> extends HTMLElement {
    protected listContainer: HTMLElement;
    protected loadingComponent: LoadingComponent | null;
    protected itemTemplate: HTMLTemplateElement | null = null;
    protected currentItemCount: number = 0;
    protected itemsPerPage: number = 10;
    protected total: number = 0;

    constructor() {
        super();
        this.listContainer = this.querySelector("[data-list-container]") as HTMLElement;
        this.loadingComponent = this.querySelector<LoadingComponent>("loading-component");
    }

    protected async loadTemplate(path: string) {
        this.itemTemplate = (await fetchAndParseTemplate(
            path
        )) as HTMLTemplateElement;
    }

    protected async fetchData(url: string) {
        this.loadingComponent?.show();
        try {
            const data = await CustomFetch.fetch<T>(url);
            this.handleFetchSuccess(data);
        } catch (error: unknown) {
            this.handleFetchError(error);
        } finally {
            this.loadingComponent?.hide();
        }
    }

    protected handleFetchSuccess(data: T) {
        const items = this.getItems(data);
        this.total = this.getTotal(data);

        if (this.total === 0) {
            this.renderMessage("notFound");
            return;
        }

        this.currentItemCount += items.length;
        this.renderList(items);
        this.onRenderComplete(data);
    }

    protected handleFetchError(error: unknown) {
        if (error instanceof Error) {
            console.error(`Error fetching data: ${error.message}`);
        } else {
            console.error("An unexpected error occurred");
        }
        this.renderMessage("error");
    }

    protected renderList(items: U[]) {
        const fragment = new DocumentFragment();
        items
            .map((item, index) => this.createItem(item, index))
            .forEach(itemElement => itemElement && fragment.appendChild(itemElement));
        this.listContainer.appendChild(fragment);
    }

    protected renderMessage(type: "notFound" | "error" | "message") {
        const messageTemplate = document.querySelector(
            `#tp-${type}`
        ) as HTMLTemplateElement;
        if (!messageTemplate) return;

        this.listContainer.innerHTML = "";
        this.listContainer.appendChild(messageTemplate.content.cloneNode(true));
    }

    // Abstract methods to be implemented by subclasses
    protected abstract getItems(data: T): U[];
    protected abstract getTotal(data: T): number;
    protected abstract createItem(item: U, index: number): HTMLElement | null;
    protected abstract onRenderComplete(data: T): void;
}
