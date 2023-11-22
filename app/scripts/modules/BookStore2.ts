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

    setState(newState: IBookState) {
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

    setLibraries(newLibries: TLibraries) {
        this.library.set(newLibries);
    }

    addLibraries(code: string, name: string) {
        this.library.add(code, name);
    }

    removeLibraries(code: string) {
        this.library.remove(code);
    }

    hasLibrary(code: string) {
        return this.library.has(code);
    }

    // Region 관련 메서드

    getRegions() {
        return this.regions.get();
    }

    setRegions(newRegions: TRegions) {
        this.regions.set(newRegions);
    }

    addRegion(name: string) {
        this.regions.add(name);
    }

    removeRegion(name: string) {
        this.regions.remove(name);
    }

    addDetailRegion(
        regionName: string,
        detailName: string,
        detailCode: string
    ) {
        this.regions.addDetail(regionName, detailName, detailCode);
    }

    removeDetailRegion(regionName: string, detailName: string) {
        this.regions.removeDetail(regionName, detailName);
    }

    // subscribe
    subscribeToCategoryUpdate(
        subscriber: (params: ICategoryUpdateProps) => void
    ) {
        this.bookCategory.subscribeCategoryUpdate(subscriber);
    }

    subscribeCategoryBookUpdate(subscriber: TSubscriberVoid) {
        this.bookCategory.subscribeCategoryBookUpdate(subscriber);
    }
}

const bookStore2 = new BookStore2();

export default bookStore2;
