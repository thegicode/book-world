import bookStore2 from "../../modules/BookStore2";

export default class FavoriteNav extends HTMLElement {
    nav: HTMLElement | null;
    overlayCategory: HTMLElement;
    category: string | null;

    constructor() {
        super();

        this.nav = this.querySelector(".favorite-category");

        this.overlayCategory = document.querySelector(
            "overlay-category"
        ) as HTMLElement;

        const params = new URLSearchParams(location.search);
        this.category = params.get("category");

        this.handleCategoryChange = this.handleCategoryChange.bind(this);
    }

    connectedCallback() {
        if (this.category === null) {
            this.category = bookStore2.getSortedFavoriteKeys()[0];
            const url = this.getUrl(this.category);
            location.search = url;
        }

        this.render();
        this.overlayCatalog();

        bookStore2.subscribeToFavoritesUpdate(
            this
                .handleCategoryChange as TSubscriberCallback<IFavoritesUpdateProps>
        );
    }

    disconnectedCallback() {
        bookStore2.unsubscribeToFavoritesUpdate(
            this
                .handleCategoryChange as TSubscriberCallback<IFavoritesUpdateProps>
        );
    }

    private render() {
        if (!this.nav) return;
        this.nav.innerHTML = "";

        const fragment = new DocumentFragment();

        bookStore2.getSortedFavoriteKeys().forEach((category: string) => {
            const el = this.createItem(category);
            fragment.appendChild(el);
        });

        this.nav.appendChild(fragment);

        this.hidden = false;
    }

    private createItem(category: string) {
        const el = document.createElement("a") as HTMLAnchorElement;
        el.textContent = category;
        el.href = `?${this.getUrl(category)}`;

        if (category === this.category) {
            el.ariaSelected = "true";
        }

        el.addEventListener("click", (event) => {
            this.onChange(category, el, event);
        });

        return el;
    }

    private onChange(category: string, el: HTMLElement, event: Event) {
        event.preventDefault();

        el.ariaSelected = "true";

        location.search = this.getUrl(category);
        this.category = category;
    }

    private getUrl(category: string) {
        const categoryStr = encodeURIComponent(category);
        return `category=${categoryStr}`;
    }

    private overlayCatalog() {
        const modal = this.overlayCategory;
        const changeButton = this.querySelector(".favorite-changeButton");
        changeButton?.addEventListener("click", () => {
            modal.hidden = Boolean(!modal.hidden);
        });
    }

    private handleCategoryChange({ type, payload }: IFavoritesUpdateProps) {
        switch (type) {
            case "add":
                {
                    const element = this.createItem(payload.name as string);
                    this.nav?.appendChild(element);
                }
                break;
            case "rename":
                {
                    if (!this.nav) return;
                    const prevName = payload.prevName as string;
                    const newName = payload.newName as string;
                    const index = bookStore2
                        .getSortedFavoriteKeys()
                        .indexOf(prevName);
                    this.nav.querySelectorAll("a")[index].textContent = newName;
                    bookStore2.renameSortedFavoriteKey(prevName, newName);

                    if (this.category === prevName) {
                        location.search = this.getUrl(newName);
                    }
                }
                break;
            case "delete": {
                const name = payload.name as string;
                const deletedIndex = bookStore2.deleteSortedFavoriteKey(name);
                if (deletedIndex > -1) {
                    this.nav?.querySelectorAll("a")[deletedIndex].remove();
                }
                break;
            }
            case "change": {
                const { targetIndex, draggedIndex } = payload;
                if (targetIndex === undefined || draggedIndex === undefined)
                    return;
                const navLinks = this.nav?.querySelectorAll("a");
                if (navLinks) {
                    const targetEl = navLinks[targetIndex].cloneNode(true);
                    const draggedEl = navLinks[draggedIndex].cloneNode(true);

                    navLinks[draggedIndex].replaceWith(targetEl);
                    navLinks[targetIndex].replaceWith(draggedEl);
                }
            }
        }
    }
}
