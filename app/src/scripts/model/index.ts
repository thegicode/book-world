import { STORAGE_NAME } from "./constants";
import Publisher from "../utils/Publisher";
import FavoriteModel from "./FavoriteModel";
import LibraryModel from "./LibraryModel";
import RegionModel from "./RegionModel";

const cloneDeep = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
};

const initialState: IBookState = {
    favorites: {},
    sortedFavoriteKeys: [],
    libraries: {},
    regions: {},
};

class BookModel {
    private favoriteModel: FavoriteModel;
    private libraryModel: LibraryModel;
    private regionModel: RegionModel;
    private bookStateUpdatePublisher: Publisher = new Publisher();

    constructor() {
        const state = this.loadStorage() || cloneDeep(initialState);

        const { favorites, sortedFavoriteKeys, libraries, regions } = state;
        this.favoriteModel = new FavoriteModel(favorites, sortedFavoriteKeys);
        this.libraryModel = new LibraryModel(libraries);
        this.regionModel = new RegionModel(regions);
    }

    // localStorage 관련
    private loadStorage() {
        const storageData = localStorage.getItem(STORAGE_NAME);
        return storageData ? JSON.parse(storageData) : null;
    }

    private setStorage(newState: IBookState) {
        try {
            localStorage.setItem(STORAGE_NAME, JSON.stringify(newState));
        } catch (error) {
            console.error(error);
        }
    }

    // state 관련

    get state() {
        return this.loadStorage();
    }

    set state(newState: IBookState) {
        this.setStorage(newState);

        const { favorites, sortedFavoriteKeys, libraries, regions } = newState;
        this.favoriteModel.favorites = favorites;
        this.favoriteModel.sortedKeys = sortedFavoriteKeys;
        this.libraryModel.libraries = libraries;
        this.regionModel.regions = regions;

        this.bookStateUpdatePublisher.notify();

        console.log("set state");
    }

    get favorites() {
        return this.favoriteModel.favorites;
    }

    get sortedFavoriteKeys() {
        return this.favoriteModel.sortedKeys;
    }

    get libraries() {
        return this.libraryModel.libraries;
    }

    get regions() {
        return this.regionModel.regions;
    }

    resetState() {
        this.state = initialState;
    }

    // favorites 관련 메서드

    setFavorites() {
        const newState = this.state;
        newState.favorites = this.favorites;
        newState.sortedFavoriteKeys = this.sortedFavoriteKeys;
        this.setStorage(newState);
    }

    addfavorite(name: string) {
        this.favoriteModel.add(name);
        this.favoriteModel.addSortedKeys(name);

        this.setFavorites();
    }

    renameFavorite(prevName: string, newName: string) {
        this.favoriteModel.rename(prevName, newName);

        this.setFavorites();
    }

    renameSortedFavoriteKey(prevName: string, newName: string) {
        this.favoriteModel.renameSortedKeys(prevName, newName);

        this.setFavorites();
    }

    deleteFavorite(name: string) {
        this.favoriteModel.delete(name);

        this.setFavorites();
    }

    deleteSortedFavoriteKey(name: string) {
        const index = this.favoriteModel.deleteSortedKeys(name);

        this.setFavorites();
        return index;
    }

    hasFavorite(name: string) {
        return this.favoriteModel.has(name);
    }

    changeFavorite(draggedKey: string, targetKey: string) {
        this.favoriteModel.change(draggedKey, targetKey);

        this.setFavorites();
    }

    addFavoriteBook(name: string, isbn: string) {
        this.favoriteModel.addBook(name, isbn);

        this.setFavorites();
    }

    hasFavoriteBook(name: string, isbn: string) {
        return this.favoriteModel.hasBook(name, isbn);
    }

    removeFavoriteBook(name: string, isbn: string) {
        this.favoriteModel.removeBook(name, isbn);

        this.setFavorites();
    }

    // Library 관련 메서드

    setLibraries() {
        const newState = this.state;
        newState.libraries = this.libraries;
        this.setStorage(newState);
    }

    addLibraries(code: string, data: ILibraryData) {
        this.libraryModel.add(code, data);
        this.setLibraries();
    }

    removeLibraries(code: string) {
        this.libraryModel.remove(code);

        this.setLibraries();
    }

    hasLibrary(code: string) {
        return this.libraryModel.has(code);
    }

    // Region 관련 메서드

    setRegions() {
        const newState = this.state;
        newState.regions = this.regions;
        this.setStorage(newState);
    }

    addRegion(name: string) {
        this.regionModel.add(name);

        this.setRegions();
    }

    removeRegion(name: string) {
        this.regionModel.remove(name);

        this.setRegions();
    }

    addDetailRegion(
        regionName: string,
        detailName: string,
        detailCode: string
    ) {
        this.regionModel.addDetail(regionName, detailName, detailCode);

        this.setRegions();
    }

    removeDetailRegion(regionName: string, detailName: string) {
        this.regionModel.removeDetail(regionName, detailName);

        this.setRegions();
    }

    // subscribe

    subscribeToBookStateUpdate(subscriber: TSubscriberVoid) {
        this.bookStateUpdatePublisher.subscribe(subscriber);
    }
    unsubscribeToBookStateUpdate(subscriber: TSubscriberVoid) {
        this.bookStateUpdatePublisher.unsubscribe(subscriber);
    }

    subscribeFavoriteCategoriesUpdate(subscriber: TFavoritesUpdateSubscriber) {
        this.favoriteModel.subscribeCategoriesUpdate(subscriber);
    }
    unsubscribeFavoriteCategoriesUpdate(
        subscriber: TFavoritesUpdateSubscriber
    ) {
        this.favoriteModel.unsubscribeCategoriesUpdate(subscriber);
    }

    subscribeFavoriteBookUpdate(subscriber: TSubscriberVoid) {
        this.favoriteModel.subscribeBookUpdate(subscriber);
    }
    unsubscribeFavoriteBookUpdate(subscriber: TSubscriberVoid) {
        this.favoriteModel.unsubscribeBookUpdate(subscriber);
    }

    subscribeLibraryUpdate(subscriber: TLibrarysUpdateSubscriber) {
        this.libraryModel.subscribeUpdate(subscriber);
    }
    unsubscribeLibraryUpdate(subscriber: TLibrarysUpdateSubscriber) {
        this.libraryModel.unsubscribeUpdate(subscriber);
    }

    subscribeRegionUpdate(subscriber: TSubscriberVoid) {
        this.regionModel.subscribeUpdatePublisher(subscriber);
    }
    unsubscribeRegionUpdate(subscriber: TSubscriberVoid) {
        this.regionModel.unsubscribeUpdatePublisher(subscriber);
    }

    subscribeDetailRegionUpdate(subscriber: TSubscriberVoid) {
        this.regionModel.subscribeDetailUpdatePublisher(subscriber);
    }
    unsubscribeDetailRegionUpdate(subscriber: TSubscriberVoid) {
        this.regionModel.unsubscribeDetailUpdatePublisher(subscriber);
    }
}

const bookModel = new BookModel();

export default bookModel;
