import { STORAGE_NAME } from "./constants";
import Publisher from "@/utils/Publisher";
import FavoriteModel from "./FavoriteModel";
import LibraryModel from "./LibraryModel";

export enum BookModelEvent {
    FavoriteCategoriesUpdate = "favoriteCategoriesUpdate",
    FavoriteBookUpdate = "favoriteBookUpdate",
    LibraryUpdate = "libraryUpdate",
    BookStateUpdate = "bookStateUpdate",
}

const cloneDeep = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
};

const initialState: IBookState = {
    favorites: {},
    favoriteCategoryOrder: [],
    libraries: {},
};

class BookModel {
    private favoriteModel: FavoriteModel;
    private libraryModel: LibraryModel;
    private bookStateUpdatePublisher: Publisher = new Publisher();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private publishers: Record<string, Publisher<any>>;

    private _state: IBookState;

    constructor() {
        this._state = this.loadStorage() || cloneDeep(initialState);
        console.log("BookModel Initialized (v2) with state:", this._state);

        const { favorites, favoriteCategoryOrder, libraries } = this._state;
        this.favoriteModel = new FavoriteModel(favorites, favoriteCategoryOrder);
        this.libraryModel = new LibraryModel(libraries);

        this.publishers = {
            [BookModelEvent.FavoriteCategoriesUpdate]:
                this.favoriteModel.getCategoriesUpdatePublisher(),
            [BookModelEvent.FavoriteBookUpdate]:
                this.favoriteModel.getBookUpdatePublisher(),
            [BookModelEvent.LibraryUpdate]:
                this.libraryModel.getUpdatePublisher(),
            [BookModelEvent.BookStateUpdate]: this.bookStateUpdatePublisher,
        };
    }

    // localStorage 관련
    private loadStorage(): IBookState | null {
        const storageData = localStorage.getItem(STORAGE_NAME);
        if (!storageData) return null;
        
        const parsed = JSON.parse(storageData);

        // Migrate sortedFavoriteKeys to favoriteCategoryOrder
        if (parsed.sortedFavoriteKeys) {
            parsed.favoriteCategoryOrder = parsed.sortedFavoriteKeys;
            delete parsed.sortedFavoriteKeys;
        }

        // Remove regions if it exists in stored data
        if (parsed.regions) {
            delete parsed.regions;
        }

        // Migrate libraries to keep only libCode and libName
        if (parsed.libraries) {
            const migratedLibraries: TLibraries = {};
            for (const [code, data] of Object.entries(parsed.libraries as TLibraries)) {
                migratedLibraries[code] = {
                    libCode: data.libCode,
                    libName: data.libName,
                };
            }
            parsed.libraries = migratedLibraries;
        }
        
        return parsed;
    }

    private _commit() {
        try {
            localStorage.setItem(STORAGE_NAME, JSON.stringify(this._state));
            this.bookStateUpdatePublisher.notify();
        } catch (error) {
            console.error(error);
        }
    }

    // state 관련
    get state(): IBookState {
        return this._state;
    }

    set state(newState: IBookState) {
        this._state = newState;

        const { favorites, favoriteCategoryOrder, libraries } = newState;
        this.favoriteModel.favorites = favorites;
        this.favoriteModel.categoryOrder = favoriteCategoryOrder;
        this.libraryModel.libraries = libraries;

        this._commit();
        console.log("set state");
    }

    get favorites() {
        return this.favoriteModel.favorites;
    }

    get favoriteCategoryOrder() {
        return this.favoriteModel.categoryOrder;
    }

    get libraries() {
        return this.libraryModel.libraries;
    }

    resetState() {
        this.state = initialState;
    }

    // favorites 관련 메서드
    addfavorite(name: string) {
        this.favoriteModel.addCategoryOrder(name);
        this.favoriteModel.add(name);

        this._state.favorites = this.favorites;
        this._state.favoriteCategoryOrder = this.favoriteCategoryOrder;
        this._commit();
    }

    renameFavorite(prevName: string, newName: string) {
        this.favoriteModel.renameCategoryOrder(prevName, newName);
        this.favoriteModel.rename(prevName, newName);

        this._state.favorites = this.favorites;
        this._state.favoriteCategoryOrder = this.favoriteCategoryOrder;
        this._commit();
    }

    renameCategoryOrderKey(prevName: string, newName: string) {
        this.favoriteModel.renameCategoryOrder(prevName, newName);

        this._state.favoriteCategoryOrder = this.favoriteCategoryOrder;
        this._commit();
    }

    deleteFavorite(name: string) {
        this.favoriteModel.deleteCategoryOrder(name);
        this.favoriteModel.delete(name);

        this._state.favorites = this.favorites;
        this._state.favoriteCategoryOrder = this.favoriteCategoryOrder;
        this._commit();
    }

    deleteCategoryOrderKey(name: string) {
        const index = this.favoriteModel.deleteCategoryOrder(name);

        this._state.favoriteCategoryOrder = this.favoriteCategoryOrder;
        this._commit();
        return index;
    }

    hasFavorite(name: string) {
        return this.favoriteModel.has(name);
    }

    changeFavorite(draggedKey: string, targetKey: string) {
        this.favoriteModel.change(draggedKey, targetKey);

        this._state.favoriteCategoryOrder = this.favoriteCategoryOrder;
        this._commit();
    }

    addFavoriteBook(name: string, isbn: string) {
        this.favoriteModel.addBook(name, isbn);

        this._state.favorites = this.favorites;
        this._commit();
    }

    hasFavoriteBook(name: string, isbn: string) {
        return this.favoriteModel.hasBook(name, isbn);
    }

    removeFavoriteBook(name: string, isbn: string) {
        this.favoriteModel.removeBook(name, isbn);

        this._state.favorites = this.favorites;
        this._commit();
    }

    // Library 관련 메서드
    addLibraries(code: string, data: ILibraryData) {
        this.libraryModel.add(code, {
            libCode: data.libCode,
            libName: data.libName,
        });

        this._state.libraries = this.libraries;
        this._commit();
    }

    removeLibraries(code: string) {
        this.libraryModel.remove(code);

        this._state.libraries = this.libraries;
        this._commit();
    }

    hasLibrary(code: string) {
        return this.libraryModel.has(code);
    }

    public subscribe<T>(
        eventName: BookModelEvent,
        subscriber: TSubscriberCallback<T>
    ) {
        const publisher = this.publishers[eventName];
        if (publisher) {
            publisher.subscribe(subscriber);
        }
    }

    public unsubscribe<T>(
        eventName: BookModelEvent,
        subscriber: TSubscriberCallback<T>
    ) {
        const publisher = this.publishers[eventName];
        if (publisher) {
            publisher.unsubscribe(subscriber);
        }
    }
}



const bookModel = new BookModel();

export default bookModel;
