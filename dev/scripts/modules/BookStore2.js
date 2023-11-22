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
    setState(newState) {
        // this.state = cloneDeep(newState);
        this.setStorage(newState);
        console.log("setStorage and loadStorage", this.loadStorage());
    }
    resetState() {
        // this.state = cloneDeep(initialState);
        this.setStorage(initialState);
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
        this.setState(newState);
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
    setLibraries(newLibries) {
        this.library.set(newLibries);
    }
    addLibraries(code, name) {
        this.library.add(code, name);
    }
    removeLibraries(code) {
        this.library.remove(code);
    }
    hasLibrary(code) {
        return this.library.has(code);
    }
    // Region 관련 메서드
    getRegions() {
        return this.regions.get();
    }
    setRegions(newRegions) {
        this.regions.set(newRegions);
    }
    addRegion(name) {
        this.regions.add(name);
    }
    removeRegion(name) {
        this.regions.remove(name);
    }
    addDetailRegion(regionName, detailName, detailCode) {
        this.regions.addDetail(regionName, detailName, detailCode);
    }
    removeDetailRegion(regionName, detailName) {
        this.regions.removeDetail(regionName, detailName);
    }
    // subscribe
    subscribeToCategoryUpdate(subscriber) {
        this.bookCategory.subscribeCategoryUpdate(subscriber);
    }
    subscribeCategoryBookUpdate(subscriber) {
        this.bookCategory.subscribeCategoryBookUpdate(subscriber);
    }
}
const bookStore2 = new BookStore2();
export default bookStore2;
//# sourceMappingURL=BookStore2.js.map