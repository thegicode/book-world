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



const initialState: IBookState = {
    favorites: {},
    favoriteCategoryOrder: [],
    libraries: {},
    libraryOrder: [],
};

class BookModel {
    private favoriteModel: FavoriteModel;
    private libraryModel: LibraryModel;
    private bookStateUpdatePublisher: Publisher = new Publisher();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private publishers: Record<string, Publisher<any>>;

    constructor() {
        const loaded = this.loadStorage() || structuredClone(initialState);

        this.favoriteModel = new FavoriteModel(loaded.favorites, loaded.favoriteCategoryOrder);
        this.libraryModel = new LibraryModel(loaded.libraries, loaded.libraryOrder);

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
        
        // Migrate libraryOrder if missing
        if (!parsed.libraryOrder && parsed.libraries) {
            parsed.libraryOrder = Object.keys(parsed.libraries);
        }

        return parsed;
    }

    private _commit() {
        try {
            localStorage.setItem(STORAGE_NAME, JSON.stringify(this.state));
            this.bookStateUpdatePublisher.notify();
        } catch (error) {
            console.error(error);
        }
    }

    // state 관련
    get state(): IBookState {
        return {
            favorites: this.favoriteModel.favorites,
            favoriteCategoryOrder: this.favoriteModel.categoryOrder,
            libraries: this.libraryModel.libraries,
            libraryOrder: this.libraryModel.libraryOrder,
        };
    }

    set state(newState: IBookState) {
        this.favoriteModel.favorites = newState.favorites;
        this.favoriteModel.categoryOrder = newState.favoriteCategoryOrder;
        this.libraryModel.libraries = newState.libraries;
        this.libraryModel.libraryOrder = newState.libraryOrder;
        this._commit();
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

    get libraryOrder() {
        return this.libraryModel.libraryOrder;
    }

    resetState() {
        this.state = initialState;
    }

    // favorites 관련 메서드
    addFavorite(name: string) {
        this.favoriteModel.addCategoryOrder(name);
        this.favoriteModel.add(name);
        this._commit();
    }

    renameFavorite(prevName: string, newName: string) {
        this.favoriteModel.renameCategoryOrder(prevName, newName);
        this.favoriteModel.rename(prevName, newName);
        this._commit();
    }

    renameCategoryOrderKey(prevName: string, newName: string) {
        this.favoriteModel.renameCategoryOrder(prevName, newName);
        this._commit();
    }

    deleteFavorite(name: string) {
        this.favoriteModel.deleteCategoryOrder(name);
        this.favoriteModel.delete(name);
        this._commit();
    }

    deleteCategoryOrderKey(name: string) {
        const index = this.favoriteModel.deleteCategoryOrder(name);
        this._commit();
        return index;
    }

    hasFavorite(name: string) {
        return this.favoriteModel.has(name);
    }

    changeFavorite(draggedKey: string, targetKey: string) {
        this.favoriteModel.change(draggedKey, targetKey);
        this._commit();
    }

    addFavoriteBook(name: string, isbn: string) {
        this.favoriteModel.addBook(name, isbn);
        this._commit();
    }

    hasFavoriteBook(name: string, isbn: string) {
        return this.favoriteModel.hasBook(name, isbn);
    }

    removeFavoriteBook(name: string, isbn: string) {
        this.favoriteModel.removeBook(name, isbn);
        this._commit();
    }

    // Library 관련 메서드
    addLibrary(code: string, data: ILibraryData) {
        this.libraryModel.add(code, {
            libCode: data.libCode,
            libName: data.libName,
        });
        this._commit();
    }

    removeLibrary(code: string) {
        this.libraryModel.remove(code);
        this._commit();
    }

    hasLibrary(code: string) {
        return this.libraryModel.has(code);
    }

    public getPublisher<T>(eventName: BookModelEvent): Publisher<T> {
        return this.publishers[eventName] as Publisher<T>;
    }
}



const bookModel = new BookModel();

export default bookModel;
