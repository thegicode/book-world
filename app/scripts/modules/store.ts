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

    subscribe(listener) {
        this.listeners.push(listener);
    },

    unsubscribe(callback) {
        this.listeners = this.listeners.filter(
            (subscriber) => subscriber !== callback
        );
    },

    notify() {
        this.listeners.forEach((listener) => listener());
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

    set category(name) {
        // this.state.category = { ...this.state.category, newCategory };
        console.log(this.state.category);
        // console.log("store favorites: ", this.state.category);
    },

    get libraries() {
        return cloneDeep(this.state.libraries);
    },

    set libraries(newLibries) {
        this.state.libraries = newLibries;
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

    addCategory(name) {
        const newFavorites = this.category;
        newFavorites[name] = [];
        this.category = newFavorites;
    },

    hasCategory(name) {
        return name in this.category;
    },

    renameCategory(prevName, newName) {
        const newFavorites = this.category;
        newFavorites[prevName] = newFavorites[newName];
        delete newFavorites[prevName];

        this.category = newFavorites;
    },

    deleteCategory(name) {
        const newFavorites = this.category;
        delete newFavorites[name];
        this.category = newFavorites;
    },

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
