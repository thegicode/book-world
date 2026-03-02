import Publisher from "@/utils/Publisher";

export default class FavoriteModel {
    private _favorites: TFavoriteFavorites;
    private _categoryOrder: TFavoriteCategoryOrder;
    private categoriesUpdatePublisher: Publisher<IFavoritesUpdateProps> =
        new Publisher();
    private bookUpdatePublisher: Publisher = new Publisher();

    constructor(
        categories: TFavoriteFavorites,
        categoryOrder: TFavoriteCategoryOrder
    ) {
        this._favorites = categories || {};
        this._categoryOrder = categoryOrder || [];
    }

    get favorites(): TFavoriteFavorites {
        return structuredClone(this._favorites);
    }

    set favorites(newCategories: TFavoriteFavorites) {
        this._favorites = newCategories;
    }

    get categoryOrder(): TFavoriteCategoryOrder {
        return structuredClone(this._categoryOrder);
    }

    set categoryOrder(newKeys: TFavoriteCategoryOrder) {
        this._categoryOrder = newKeys;
    }

    add(name: string) {
        this._favorites[name] = [];
        this.categoriesUpdatePublisher.notify({
            type: "add",
            payload: { name },
        });
    }

    addCategoryOrder(name: string) {
        this._categoryOrder.push(name);
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

    renameCategoryOrder(prevName: string, newName: string) {
        const index = this._categoryOrder.indexOf(prevName);
        if (index !== -1) {
            this._categoryOrder[index] = newName;
        }
    }

    change(draggedKey: string, targetKey: string) {
        const draggedIndex = this._categoryOrder.indexOf(draggedKey);
        const targetIndex = this._categoryOrder.indexOf(targetKey);
        this._categoryOrder[targetIndex] = draggedKey;
        this._categoryOrder[draggedIndex] = targetKey;

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

    deleteCategoryOrder(name: string): number {
        const index = this._categoryOrder.indexOf(name);
        this._categoryOrder.splice(index, 1);
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
            if (index !== -1) {
                this._favorites[name].splice(index, 1);
            }
        }

        this.bookUpdatePublisher.notify();
    }

    public getCategoriesUpdatePublisher(): Publisher<IFavoritesUpdateProps> {
        return this.categoriesUpdatePublisher;
    }

    public getBookUpdatePublisher(): Publisher {
        return this.bookUpdatePublisher;
    }
}
