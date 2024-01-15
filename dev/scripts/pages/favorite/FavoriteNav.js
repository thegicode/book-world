import bookModel from "../../model";
export default class FavoriteNav extends HTMLElement {
    constructor() {
        super();
        this.nav = this.querySelector(".favorite-category");
        this.overlayCategory = document.querySelector("overlay-category");
        this.changButton = this.querySelector(".favorite-changeButton");
        this.category = null;
        this.handleOverlayCatalog = this.handleOverlayCatalog.bind(this);
        this.subscribeCategoryChange = this.subscribeCategoryChange.bind(this);
    }
    connectedCallback() {
        this.intialize();
        this.render();
        this.changButton.addEventListener("click", this.handleOverlayCatalog);
        bookModel.subscribeToFavoritesUpdate(this
            .subscribeCategoryChange);
    }
    disconnectedCallback() {
        this.changButton.removeEventListener("click", this.handleOverlayCatalog);
        bookModel.unsubscribeToFavoritesUpdate(this
            .subscribeCategoryChange);
    }
    intialize() {
        this.category =
            new URLSearchParams(location.search).get("category") ||
                bookModel.sortedFavoriteKeys[0];
        // if (this.category === null) {
        //     this.category = bookModel.sortedFavoriteKeys[0];
        //     location.search = this.getUrl(this.category);
        // }
    }
    render() {
        const fragment = new DocumentFragment();
        bookModel.sortedFavoriteKeys
            .map((category) => this.createItem(category))
            .forEach((element) => fragment.appendChild(element));
        this.nav.innerHTML = "";
        this.nav.appendChild(fragment);
        this.hidden = false;
    }
    createItem(category) {
        const element = document.createElement("a");
        element.ariaSelected = (category === this.category).toString();
        this.updateItem(element, category);
        return element;
    }
    updateItem(element, name) {
        element.textContent = name;
        element.href = `?${this.getUrl(name)}`;
    }
    handleOverlayCatalog() {
        this.overlayCategory.hidden = Boolean(!this.overlayCategory.hidden);
    }
    getUrl(category) {
        return `category=${encodeURIComponent(category)}`;
    }
    subscribeCategoryChange({ type, payload }) {
        const actions = {
            add: () => this.handlAdd(payload.name),
            rename: () => this.handlRename(payload.prevName, payload.newName),
            delete: () => this.handlDelete(payload.name),
            change: () => this.handlChange(payload.targetIndex, payload.draggedIndex),
        };
        if (actions[type]) {
            actions[type]();
        }
        else {
            console.error("No subscribe type");
        }
    }
    handlAdd(name) {
        this.nav.appendChild(this.createItem(name));
    }
    handlRename(prevName, newName) {
        this.updateItem(this.nav.querySelectorAll("a")[bookModel.sortedFavoriteKeys.indexOf(prevName)], newName);
        bookModel.renameSortedFavoriteKey(prevName, newName);
        if (this.category === prevName) {
            location.search = this.getUrl(newName);
        }
    }
    handlDelete(name) {
        const deletedIndex = bookModel.deleteSortedFavoriteKey(name);
        this.nav.querySelectorAll("a")[deletedIndex].remove();
    }
    handlChange(targetIndex, draggedIndex) {
        const navs = this.nav.querySelectorAll("a");
        const dragged = navs[draggedIndex];
        const targeted = navs[targetIndex];
        dragged.replaceWith(targeted.cloneNode(true));
        targeted.replaceWith(dragged.cloneNode(true));
    }
}
//# sourceMappingURL=FavoriteNav.js.map