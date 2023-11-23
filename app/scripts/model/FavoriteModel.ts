import Publisher from "../utils/Publisher";

export default class FavoriteModel {
    private _favorites: TFavoriteFavorites;
    private _sortedKeys: TSortedFavoriteKeys;
    private categoriesUpdatePublisher: Publisher<IFavoritesUpdateProps> =
        new Publisher();
    private bookUpdatePublisher: Publisher = new Publisher();

    constructor(
        categories: TFavoriteFavorites,
        sortedKeys: TSortedFavoriteKeys
    ) {
        this._favorites = categories;
        this._sortedKeys = sortedKeys;
    }

    get favorites(): TFavoriteFavorites {
        return { ...this._favorites };
    }

    set favorites(newCategories: TFavoriteFavorites) {
        this._favorites = newCategories;
    }

    get sortedKeys(): TSortedFavoriteKeys {
        return [...this._sortedKeys];
    }

    set sortedKeys(newKeys: TSortedFavoriteKeys) {
        this._sortedKeys = newKeys;
    }

    add(name: string) {
        this._favorites[name] = [];
        this.categoriesUpdatePublisher.notify({
            type: "add",
            payload: { name },
        });
    }

    addSortedKeys(name: string) {
        this._sortedKeys.push(name);
    }

    rename(prevName: string, newName: string) {
        if (prevName in this._favorites) {
            this._favorites[newName] = this._favorites[prevName];
            delete this._favorites[prevName];

            this.categoriesUpdatePublisher.notify({
                type: "rename",
                payload: { prevName, newName },
            });
        }
    }

    renameSortedKeys(prevName: string, newName: string) {
        const index = this._sortedKeys.indexOf(prevName);
        this._sortedKeys[index] = newName;
    }

    change(draggedKey: string, targetKey: string) {
        const draggedIndex = this._sortedKeys.indexOf(draggedKey);
        const targetIndex = this._sortedKeys.indexOf(targetKey);
        this._sortedKeys[targetIndex] = draggedKey;
        this._sortedKeys[draggedIndex] = targetKey;

        this.categoriesUpdatePublisher.notify({
            type: "change",
            payload: {
                targetIndex,
                draggedIndex,
            },
        });
    }

    delete(name: string) {
        delete this._favorites[name];

        this.categoriesUpdatePublisher.notify({
            type: "delete",
            payload: { name },
        });
    }

    deleteSortedKeys(name: string): number {
        const index = this._sortedKeys.indexOf(name);
        this._sortedKeys.splice(index, 1);
        return index;
    }

    has(name: string) {
        return name in this._favorites;
    }

    addBook(name: string, isbn: string) {
        if (name in this._favorites) {
            this._favorites[name].unshift(isbn);
        }

        this.bookUpdatePublisher.notify();
    }

    hasBook(name: string, isbn: string) {
        return name in this._favorites && this._favorites[name].includes(isbn);
    }

    removeBook(name: string, isbn: string) {
        if (name in this._favorites) {
            const index = this._favorites[name].indexOf(isbn);
            if (index != -1) {
                this._favorites[name].splice(index, 1);
            }
        }

        this.bookUpdatePublisher.notify();
    }

    subscribeFavoritesUpdate(
        subscriber: (params: IFavoritesUpdateProps) => void
    ) {
        this.categoriesUpdatePublisher.subscribe(
            subscriber as TSubscriberCallback<IFavoritesUpdateProps>
        );
    }
    unsubscribeFavoritesUpdate(
        subscriber: (params: IFavoritesUpdateProps) => void
    ) {
        this.categoriesUpdatePublisher.unsubscribe(
            subscriber as TSubscriberCallback<IFavoritesUpdateProps>
        );
    }

    subscribeBookUpdate(subscriber: TSubscriberVoid) {
        this.bookUpdatePublisher.subscribe(subscriber);
    }
    unsubscribeBookUpdate(subscriber: TSubscriberVoid) {
        this.bookUpdatePublisher.unsubscribe(subscriber);
    }
}
