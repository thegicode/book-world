import Publisher from "../utils/Publisher";
import BookCategory from "./BookCategory";
import { STORAGE_NAME } from "./constants";
import Library from "./Library";
import Region from "./Region";

const cloneDeep = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
};

const initialState: IBookState = {
    libraries: {},
    regions: {},
    category: {},
    categorySort: [],
};

class BookStore2 {
    private bookCategory: BookCategory;
    private library: Library;
    private regions: Region;
    private bookStateUpdatePublisher: Publisher = new Publisher();

    constructor() {
        const state = this.loadStorage() || cloneDeep(initialState);

        const { category, categorySort, libraries, regions } = state;

        this.bookCategory = new BookCategory(category, categorySort);
        this.library = new Library(libraries);
        this.regions = new Region(regions);
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

    // setState(newState: IBookState) {
    //     // this.state = cloneDeep(newState);
    //     this.setStorage(newState);

    //     console.log("setStorage and loadStorage", this.loadStorage());
    // }

    setState(newState: IBookState) {
        this.setStorage(newState);

        const { category, categorySort, libraries, regions } = newState;
        this.bookCategory.set(category);
        this.bookCategory.setCategorySort(categorySort);
        this.library.set(libraries);
        this.regions.set(regions);

        this.bookStateUpdatePublisher.notify();
    }

    resetState() {
        this.setStorage(initialState);

        const { category, categorySort, libraries, regions } = initialState;
        this.bookCategory.set(category);
        this.bookCategory.setCategorySort(categorySort);
        this.library.set(libraries);
        this.regions.set(regions);

        this.bookStateUpdatePublisher.notify();
    }

    // BookCategory 관련 메서드

    getCategory() {
        return this.bookCategory.get();
    }

    getCategorySort() {
        return this.bookCategory.getCategorySort();
    }

    setCategory() {
        const newState = this.getState();
        newState.category = this.getCategory();
        newState.categorySort = this.getCategorySort();
        this.setStorage(newState);
    }

    addCategory(name: string) {
        this.bookCategory.add(name);
        this.bookCategory.addCategorySort(name);

        this.setCategory();
    }

    renameCategory(prevName: string, newName: string) {
        this.bookCategory.rename(prevName, newName);
        // this.bookCategory.renameCategorySort(prevName, newName);

        this.setCategory();
    }

    renameCategorySort(prevName: string, newName: string) {
        this.bookCategory.renameCategorySort(prevName, newName);
        // this.bookCategory.renameCategorySort(prevName, newName);

        this.setCategory();
    }

    deleteCategory(name: string) {
        this.bookCategory.delete(name);

        this.setCategory();
    }

    deleteCategorySort(name: string) {
        const index = this.bookCategory.deleteCatgorySort(name);

        this.setCategory();
        return index;
    }

    hasCategory(name: string) {
        return this.bookCategory.has(name);
    }

    changeCategory(draggedKey: string, targetKey: string) {
        this.bookCategory.change(draggedKey, targetKey);

        this.setCategory();
    }

    addBookCategory(name: string, isbn: string) {
        this.bookCategory.addBook(name, isbn);

        this.setCategory();
    }

    hasBookCategory(name: string, isbn: string) {
        return this.bookCategory.hasBook(name, isbn);
    }

    removeBookCategory(name: string, isbn: string) {
        this.bookCategory.removeBook(name, isbn);

        this.setCategory();
    }

    // Library 관련 메서드

    getLibraries() {
        return this.library.get();
    }

    setLibraries() {
        const newState = this.getState();
        newState.libraries = this.getLibraries();
        this.setStorage(newState);
    }

    addLibraries(code: string, name: string) {
        this.library.add(code, name);

        this.setLibraries();
    }

    removeLibraries(code: string) {
        this.library.remove(code);

        this.setLibraries();
    }

    hasLibrary(code: string) {
        return this.library.has(code);
    }

    // Region 관련 메서드

    getRegions() {
        return this.regions.get();
    }

    setRegions() {
        const newState = this.getState();
        newState.regions = this.getRegions();
        this.setStorage(newState);
    }

    addRegion(name: string) {
        this.regions.add(name);

        this.setRegions();
    }

    removeRegion(name: string) {
        this.regions.remove(name);

        this.setRegions();
    }

    addDetailRegion(
        regionName: string,
        detailName: string,
        detailCode: string
    ) {
        this.regions.addDetail(regionName, detailName, detailCode);

        this.setRegions();
    }

    removeDetailRegion(regionName: string, detailName: string) {
        this.regions.removeDetail(regionName, detailName);

        this.setRegions();
    }

    // subscribe
    subscribeToCategoryUpdate(
        subscriber: (params: ICategoryUpdateProps) => void
    ) {
        this.bookCategory.subscribeCategoryUpdate(subscriber);
    }
    unsubscribeToCategoryUpdate(
        subscriber: (params: ICategoryUpdateProps) => void
    ) {
        this.bookCategory.unsubscribeCategoryUpdate(subscriber);
    }

    subscribeBookUpdate(subscriber: TSubscriberVoid) {
        this.bookCategory.subscribeBookUpdate(subscriber);
    }
    unsubscribeBookUpdate(subscriber: TSubscriberVoid) {
        this.bookCategory.unsubscribeBookUpdate(subscriber);
    }
    notifyBookUpdate() {
        this.bookCategory.notifyBookUpdate();
    }

    subscribeToBookStateUpdate(subscriber: TSubscriberVoid) {
        this.bookStateUpdatePublisher.subscribe(subscriber);
    }
    unsubscribeToBookStateUpdate(subscriber: TSubscriberVoid) {
        this.bookStateUpdatePublisher.unsubscribe(subscriber);
    }

    subscribeToRegionUpdate(subscriber: TSubscriberVoid) {
        this.regions.subscribeToUpdatePublisher(subscriber);
    }
    unsubscribeToRegionUpdate(subscriber: TSubscriberVoid) {
        this.regions.unsubscribeToUpdatePublisher(subscriber);
    }

    subscribeToDetailRegionUpdate(subscriber: TSubscriberVoid) {
        this.regions.subscribeToDetailUpdatePublisher(subscriber);
    }
    unsubscribeToDetailRegionUpdate(subscriber: TSubscriberVoid) {
        this.regions.unsubscribeToDetailUpdatePublisher(subscriber);
    }
}

const bookStore2 = new BookStore2();

export default bookStore2;
