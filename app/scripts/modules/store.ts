const cloneDeep = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
};

const STORAGE_NAME = "BookWorld";

const initialState: IStorageData = {
    libraries: {},
    regions: {},
    category: {},
    categorySort: [],
};

const store: IStore = {
    listeners: [],
    librariesChangedCategory: [],

    subscribe(listener) {
        this.listeners.push(listener);
    },

    subscribeChangedCatgory(listener) {
        this.librariesChangedCategory.push(listener);
    },

    unsubscribe(callback) {
        this.listeners = this.listeners.filter(
            (subscriber) => subscriber !== callback
        );
    },

    notify() {
        this.listeners.forEach((listener) => listener());
    },

    notifyChangedCategory() {
        this.librariesChangedCategory.forEach((listener) => listener());
    },

    get storage() {
        try {
            const storageData = localStorage.getItem(STORAGE_NAME);
            const state =
                storageData === null ? this.state : JSON.parse(storageData);
            return cloneDeep(state);
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get state from localStorage.");
        }
    },

    set storage(newState) {
        try {
            localStorage.setItem(STORAGE_NAME, JSON.stringify(newState));
        } catch (error) {
            console.error(error);
        }
    },

    get state() {
        return cloneDeep(this.storage);
    },

    set state(newState) {
        this.storage = newState;
    },

    get category() {
        return cloneDeep(this.state.category);
    },

    set category(newCategory) {
        const newState = this.state;
        newState.category = newCategory;
        this.state = newState;
    },

    get categorySort() {
        return cloneDeep(this.state.categorySort);
    },
    set categorySort(newSort) {
        const newState = this.state;
        newState.categorySort = newSort;
        this.state = newState;
    },

    get libraries() {
        return cloneDeep(this.state.libraries);
    },

    set libraries(newLibries) {
        const newState = this.state;
        newState.libraries = newLibries;
        this.state = newState;
    },

    get regions() {
        return cloneDeep(this.state.regions);
    },
    set regions(newRegions) {
        const newState = this.state;
        newState.regions = newRegions;
        this.state = newState;
        // console.log(this.regions);
    },

    resetState() {
        this.storage = initialState;
    },

    // Category, CategorySort
    addCategory(name) {
        const newCategory = this.category;
        newCategory[name] = [];
        this.category = newCategory;
    },

    addCategorySort(name) {
        const newCategorySort = this.categorySort;
        newCategorySort.push(name);
        this.categorySort = newCategorySort;
    },

    hasCategory(name) {
        return name in this.category;
    },

    renameCategory(prevName, newName) {
        const newCategory = this.category;
        newCategory[newName] = newCategory[prevName];
        delete newCategory[prevName];
        this.category = newCategory;
    },

    renameCategorySort(prevName, newName) {
        const newCategorySort = this.categorySort;
        const index = newCategorySort.indexOf(prevName);
        newCategorySort[index] = newName;
        this.categorySort = newCategorySort;
    },

    deleteCategory(name) {
        const newFavorites = this.category;
        delete newFavorites[name];
        this.category = newFavorites;
    },

    changeCategory(draggedKey, targetKey) {
        const newSort = this.categorySort;
        const draggedIndex = newSort.indexOf(draggedKey);
        const targetIndex = newSort.indexOf(targetKey);
        newSort[targetIndex] = draggedKey;
        newSort[draggedIndex] = targetKey;

        this.categorySort = newSort;
    },

    // BookInCategory

    addBookInCategory(name, isbn) {
        const newCategory = this.category;
        newCategory[name].unshift(isbn);
        this.category = newCategory;

        this.notifyChangedCategory();
    },

    hasBookInCategory(name, isbn) {
        return this.category[name].includes(isbn);
    },

    removeBookInCategory(name, isbn) {
        const newCategory = this.category;
        const index = newCategory[name].indexOf(isbn);
        if (index !== -1) {
            newCategory[name].splice(index, 1);
            this.category = newCategory;
        }
        this.notifyChangedCategory();
    },

    // Book Size
    // getBookSizeInCategory() {
    //     return Object.values(store.category).reduce(
    //         (sum, currentArray: string[]) => sum + currentArray.length,
    //         0
    //     );
    // },

    // Library

    addLibrary(code, name) {
        const newLibries = this.libraries;
        newLibries[code] = name;
        this.libraries = newLibries;
    },

    removeLibrary(code) {
        const newLibries = this.libraries;
        delete newLibries[code];
        this.libraries = newLibries;
    },

    hasLibrary(code) {
        return code in this.libraries;
    },

    // Region

    addRegion(name: string) {
        const newRegion = this.regions;
        newRegion[name] = {};
        this.regions = newRegion;
    },

    removeRegion(name: string) {
        const newRegions = this.regions;
        delete newRegions[name];
        this.regions = newRegions;
    },

    addDetailRegion(regionName, detailName, detailCode) {
        const newRegions = this.regions;
        newRegions[regionName][detailName] = detailCode;
        this.regions = newRegions;
    },

    removeDetailRegion(regionName, detailName) {
        const newRegions = this.regions;
        delete newRegions[regionName][detailName];
        this.regions = newRegions;
    },
};

export default store;
