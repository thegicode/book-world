import Publisher from "../utils/Publisher";
import BookCategory from "./BookCategory";
import { STORAGE_NAME } from "./constants";
import Library from "./Library";
import Region from "./Region";
const cloneDeep = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};
const initialState = {
    libraries: {},
    regions: {},
    category: {},
    categorySort: [],
};
class BookStore2 {
    constructor() {
        this.bookStateUpdatePublisher = new Publisher();
        const state = this.loadStorage() || cloneDeep(initialState);
        const { category, categorySort, libraries, regions } = state;
        this.bookCategory = new BookCategory(category, categorySort);
        this.library = new Library(libraries);
        this.regions = new Region(regions);
    }
    // localStorage 관련
    loadStorage() {
        const storageData = localStorage.getItem(STORAGE_NAME);
        return storageData ? JSON.parse(storageData) : null;
    }
    setStorage(newState) {
        try {
            localStorage.setItem(STORAGE_NAME, JSON.stringify(newState));
        }
        catch (error) {
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
    setState(newState) {
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
    addCategory(name) {
        this.bookCategory.add(name);
        this.bookCategory.addCategorySort(name);
        this.setCategory();
    }
    renameCategory(prevName, newName) {
        this.bookCategory.rename(prevName, newName);
        // this.bookCategory.renameCategorySort(prevName, newName);
        this.setCategory();
    }
    renameCategorySort(prevName, newName) {
        this.bookCategory.renameCategorySort(prevName, newName);
        // this.bookCategory.renameCategorySort(prevName, newName);
        this.setCategory();
    }
    deleteCategory(name) {
        this.bookCategory.delete(name);
        this.setCategory();
    }
    deleteCategorySort(name) {
        const index = this.bookCategory.deleteCatgorySort(name);
        this.setCategory();
        return index;
    }
    hasCategory(name) {
        return this.bookCategory.has(name);
    }
    changeCategory(draggedKey, targetKey) {
        this.bookCategory.change(draggedKey, targetKey);
        this.setCategory();
    }
    addBookCategory(name, isbn) {
        this.bookCategory.addBook(name, isbn);
        this.setCategory();
    }
    hasBookCategory(name, isbn) {
        return this.bookCategory.hasBook(name, isbn);
    }
    removeBookCategory(name, isbn) {
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
    addLibraries(code, name) {
        this.library.add(code, name);
        this.setLibraries();
    }
    removeLibraries(code) {
        this.library.remove(code);
        this.setLibraries();
    }
    hasLibrary(code) {
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
    addRegion(name) {
        this.regions.add(name);
        this.setRegions();
    }
    removeRegion(name) {
        this.regions.remove(name);
        this.setRegions();
    }
    addDetailRegion(regionName, detailName, detailCode) {
        this.regions.addDetail(regionName, detailName, detailCode);
        this.setRegions();
    }
    removeDetailRegion(regionName, detailName) {
        this.regions.removeDetail(regionName, detailName);
        this.setRegions();
    }
    // subscribe
    subscribeToCategoryUpdate(subscriber) {
        this.bookCategory.subscribeCategoryUpdate(subscriber);
    }
    unsubscribeToCategoryUpdate(subscriber) {
        this.bookCategory.unsubscribeCategoryUpdate(subscriber);
    }
    subscribeBookUpdate(subscriber) {
        this.bookCategory.subscribeBookUpdate(subscriber);
    }
    unsubscribeBookUpdate(subscriber) {
        this.bookCategory.unsubscribeBookUpdate(subscriber);
    }
    notifyBookUpdate() {
        this.bookCategory.notifyBookUpdate();
    }
    subscribeToBookStateUpdate(subscriber) {
        this.bookStateUpdatePublisher.subscribe(subscriber);
    }
    unsubscribeToBookStateUpdate(subscriber) {
        this.bookStateUpdatePublisher.unsubscribe(subscriber);
    }
    subscribeToRegionUpdate(subscriber) {
        this.regions.subscribeToUpdatePublisher(subscriber);
    }
    unsubscribeToRegionUpdate(subscriber) {
        this.regions.unsubscribeToUpdatePublisher(subscriber);
    }
    subscribeToDetailRegionUpdate(subscriber) {
        this.regions.subscribeToDetailUpdatePublisher(subscriber);
    }
    unsubscribeToDetailRegionUpdate(subscriber) {
        this.regions.unsubscribeToDetailUpdatePublisher(subscriber);
    }
}
const bookStore2 = new BookStore2();
export default bookStore2;
//# sourceMappingURL=BookStore2.js.map