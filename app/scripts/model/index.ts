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
    getState() {
        return this.loadStorage();
    }

    setState(newState: IBookState) {
        this.setStorage(newState);

        const { favorites, sortedFavoriteKeys, libraries, regions } = newState;
        this.favoriteModel.favorites = favorites;
        this.favoriteModel.sortedKeys = sortedFavoriteKeys;
        this.libraryModel.libraries = libraries;
        this.regionModel.regions = regions;

        this.bookStateUpdatePublisher.notify();
    }

    resetState() {
        this.setState(initialState);
    }

    // favorites 관련 메서드

    getFavorites() {
        return this.favoriteModel.favorites;
    }

    getSortedFavoriteKeys() {
        return this.favoriteModel.sortedKeys;
    }

    setFavorites() {
        const newState = this.getState();
        newState.favorites = this.getFavorites();
        newState.sortedFavoriteKeys = this.getSortedFavoriteKeys();
        this.setStorage(newState);
    }

    addfavorite(name: string) {
        this.favoriteModel.add(name);
        this.favoriteModel.addSortedKeys(name);

        this.setFavorites();
    }

    renameFavorite(prevName: string, newName: string) {
        this.favoriteModel.rename(prevName, newName);
        // this.favoriteModel.renameSortedFavoriteKeys(prevName, newName);

        this.setFavorites();
    }

    renameSortedFavoriteKey(prevName: string, newName: string) {
        this.favoriteModel.renameSortedKeys(prevName, newName);
        // this.favoriteModel.renameSortedFavoriteKeys(prevName, newName);

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

    getLibraries() {
        return this.libraryModel.libraries;
    }

    setLibraries() {
        const newState = this.getState();
        newState.libraries = this.getLibraries();
        this.setStorage(newState);
    }

    addLibraries(code: string, name: string) {
        this.libraryModel.add(code, name);

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

    getRegions() {
        return this.regionModel.regions;
    }

    setRegions() {
        const newState = this.getState();
        newState.regions = this.getRegions();
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

    subscribeToFavoritesUpdate(subscriber: TFavoritesUpdateSubscriber) {
        this.favoriteModel.subscribeFavoritesUpdate(subscriber);
    }
    unsubscribeToFavoritesUpdate(subscriber: TFavoritesUpdateSubscriber) {
        this.favoriteModel.unsubscribeFavoritesUpdate(subscriber);
    }

    subscribeBookUpdate(subscriber: TSubscriberVoid) {
        this.favoriteModel.subscribeBookUpdate(subscriber);
    }
    unsubscribeBookUpdate(subscriber: TSubscriberVoid) {
        this.favoriteModel.unsubscribeBookUpdate(subscriber);
    }

    subscribeToRegionUpdate(subscriber: TSubscriberVoid) {
        this.regionModel.subscribeToUpdatePublisher(subscriber);
    }
    unsubscribeToRegionUpdate(subscriber: TSubscriberVoid) {
        this.regionModel.unsubscribeToUpdatePublisher(subscriber);
    }

    subscribeToDetailRegionUpdate(subscriber: TSubscriberVoid) {
        this.regionModel.subscribeToDetailUpdatePublisher(subscriber);
    }
    unsubscribeToDetailRegionUpdate(subscriber: TSubscriberVoid) {
        this.regionModel.unsubscribeToDetailUpdatePublisher(subscriber);
    }
}

const bookModel = new BookModel();

export default bookModel;
