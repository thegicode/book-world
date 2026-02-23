import { CustomFetch } from "@/services";
import LoadingComponent from "./LoadingComponent";

export abstract class FetchListComponent<T, U> extends HTMLElement {
    protected listContainer: HTMLElement;
    protected loadingComponent: LoadingComponent | null;
    protected currentItemCount = 0;
    protected itemsPerPage = 10;
    protected total = 0;

    constructor() {
        super();
        this.listContainer = this.querySelector("[data-list-container]") as HTMLElement;
        this.loadingComponent = this.querySelector<LoadingComponent>("loading-component");
    }

    protected async fetchData(url: string, options?: RequestInit): Promise<boolean> {
        this.listContainer.setAttribute("aria-busy", "true");
        this.loadingComponent?.show();
        try {
            const response = await CustomFetch.fetch<IApiResponse<T>>(url, options);
            if (response.status === 'success') {
                this.handleFetchSuccess(response.data);
                return true;
            } else {
                throw new Error(response.message || 'API returned an error');
            }
        } catch (error: unknown) {
            if (error instanceof DOMException && error.name === "AbortError") {
                return false;
            }
            this.handleFetchError(error);
            return false;
        } finally {
            this.listContainer.setAttribute("aria-busy", "false");
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
