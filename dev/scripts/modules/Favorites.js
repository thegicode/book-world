import Publisher from "../utils/Publisher";
export default class Favorites {
    constructor(favorites, sortedKeys) {
        this.favoritesUpdatePublisher = new Publisher();
        this.bookUpdatePublisher = new Publisher();
        this._favorites = favorites;
        this._sortedKeys = sortedKeys;
    }
    get favorites() {
        return Object.assign({}, this._favorites);
    }
    set favorites(newFavorites) {
        this._favorites = newFavorites;
    }
    get sortedKeys() {
        return [...this._sortedKeys];
    }
    set sortedKeys(newKeys) {
        this._sortedKeys = newKeys;
    }
    add(name) {
        this._favorites[name] = [];
        this.favoritesUpdatePublisher.notify({
            type: "add",
            payload: { name },
        });
    }
    addSortedKeys(name) {
        this._sortedKeys.push(name);
    }
    rename(prevName, newName) {
        if (prevName in this._favorites) {
            this._favorites[newName] = this._favorites[prevName];
            delete this._favorites[prevName];
            this.favoritesUpdatePublisher.notify({
                type: "rename",
                payload: { prevName, newName },
            });
        }
    }
    renameSortedKeys(prevName, newName) {
        const index = this._sortedKeys.indexOf(prevName);
        this._sortedKeys[index] = newName;
    }
    change(draggedKey, targetKey) {
        const draggedIndex = this._sortedKeys.indexOf(draggedKey);
        const targetIndex = this._sortedKeys.indexOf(targetKey);
        this._sortedKeys[targetIndex] = draggedKey;
        this._sortedKeys[draggedIndex] = targetKey;
        this.favoritesUpdatePublisher.notify({
            type: "change",
            payload: {
                targetIndex,
                draggedIndex,
            },
        });
    }
    delete(name) {
        delete this._favorites[name];
        this.favoritesUpdatePublisher.notify({
            type: "delete",
            payload: { name },
        });
    }
    deleteSortedKeys(name) {
        const index = this._sortedKeys.indexOf(name);
        this._sortedKeys.splice(index, 1);
        return index;
    }
    has(name) {
        return name in this._favorites;
    }
    addBook(name, isbn) {
        if (name in this._favorites) {
            this._favorites[name].unshift(isbn);
        }
        this.bookUpdatePublisher.notify();
    }
    hasBook(name, isbn) {
        return name in this._favorites && this._favorites[name].includes(isbn);
    }
    removeBook(name, isbn) {
        if (name in this._favorites) {
            const index = this._favorites[name].indexOf(isbn);
            if (index != -1) {
                this._favorites[name].splice(index, 1);
            }
        }
        this.bookUpdatePublisher.notify();
    }
    subscribeFavoritesUpdate(subscriber) {
        this.favoritesUpdatePublisher.subscribe(subscriber);
    }
    unsubscribeFavoritesUpdate(subscriber) {
        this.favoritesUpdatePublisher.unsubscribe(subscriber);
    }
    subscribeBookUpdate(subscriber) {
        this.bookUpdatePublisher.subscribe(subscriber);
    }
    unsubscribeBookUpdate(subscriber) {
        this.bookUpdatePublisher.unsubscribe(subscriber);
    }
}
//# sourceMappingURL=Favorites.js.map