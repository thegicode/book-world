import bookModel from "../../model";

export default class FavoriteNav extends HTMLElement {
    private nav: HTMLElement;
    private overlayCategory: HTMLElement;
    private changButton: HTMLButtonElement;
    private category: string | null;

    constructor() {
        super();

        this.nav = this.querySelector(".favorite-category") as HTMLElement;
        this.overlayCategory = document.querySelector(
            "overlay-category"
        ) as HTMLElement;
        this.changButton = this.querySelector(
            ".favorite-changeButton"
        ) as HTMLButtonElement;

        this.category = null;

        this.handleOverlayCatalog = this.handleOverlayCatalog.bind(this);
        this.subscribeCategoryChange = this.subscribeCategoryChange.bind(this);
    }

    connectedCallback() {
        this.intialize();
        this.render();

        this.changButton.addEventListener("click", this.handleOverlayCatalog);
        bookModel.subscribeToFavoritesUpdate(
            this
                .subscribeCategoryChange as TSubscriberCallback<IFavoritesUpdateProps>
        );
    }

    disconnectedCallback() {
        this.changButton.removeEventListener(
            "click",
            this.handleOverlayCatalog
        );
        bookModel.unsubscribeToFavoritesUpdate(
            this
                .subscribeCategoryChange as TSubscriberCallback<IFavoritesUpdateProps>
        );
    }

    private intialize() {
        this.category =
            new URLSearchParams(location.search).get("category") ||
            bookModel.sortedFavoriteKeys[0];

        // if (this.category === null) {
        //     this.category = bookModel.sortedFavoriteKeys[0];
        //     location.search = this.getUrl(this.category);
        // }
    }

    private render() {
        const fragment = new DocumentFragment();
        bookModel.sortedFavoriteKeys
            .map((category) => this.createItem(category))
            .forEach((element) => fragment.appendChild(element));

        this.nav.innerHTML = "";
        this.nav.appendChild(fragment);
        this.hidden = false;
    }

    private createItem(category: string) {
        const element = document.createElement("a") as HTMLAnchorElement;
        element.ariaSelected = (category === this.category).toString();
        this.updateItem(element, category);
        return element;
    }

    private updateItem(element: HTMLAnchorElement, name: string) {
        element.textContent = name;
        element.href = `?${this.getUrl(name)}`;
    }

    private handleOverlayCatalog() {
        this.overlayCategory.hidden = Boolean(!this.overlayCategory.hidden);
    }

    private getUrl(category: string) {
        return `category=${encodeURIComponent(category)}`;
    }

    private subscribeCategoryChange({ type, payload }: IFavoritesUpdateProps) {
        const actions: Record<string, () => void> = {
            add: () => this.handlAdd(payload.name as string),
            rename: () =>
                this.handlRename(
                    payload.prevName as string,
                    payload.newName as string
                ),
            delete: () => this.handlDelete(payload.name as string),
            change: () =>
                this.handlChange(
                    payload.targetIndex as number,
                    payload.draggedIndex as number
                ),
        };

        if (actions[type]) {
            actions[type]();
        } else {
            console.error("No subscribe type");
        }
    }

    private handlAdd(name: string) {
        this.nav.appendChild(this.createItem(name));
    }

    private handlRename(prevName: string, newName: string) {
        this.updateItem(
            this.nav.querySelectorAll("a")[
                bookModel.sortedFavoriteKeys.indexOf(prevName)
            ],
            newName
        );
        bookModel.renameSortedFavoriteKey(prevName, newName);

        if (this.category === prevName) {
            location.search = this.getUrl(newName);
        }
    }

    private handlDelete(name: string) {
        const deletedIndex = bookModel.deleteSortedFavoriteKey(name);
        this.nav.querySelectorAll("a")[deletedIndex].remove();
    }

    private handlChange(targetIndex: number, draggedIndex: number) {
        const navs = this.nav.querySelectorAll("a");
        const dragged = navs[draggedIndex];
        const targeted = navs[targetIndex];
        dragged.replaceWith(targeted.cloneNode(true));
        targeted.replaceWith(dragged.cloneNode(true));
    }
}
