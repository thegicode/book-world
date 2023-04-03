const cloneDeep = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
};

const initialState: IStorageData = {
    favoriteBooks: [],
    libraries: {},
    regions: {},
};

const storageKey = "BookWorld";

const setState = (newState: IStorageData) => {
    try {
        localStorage.setItem(storageKey, JSON.stringify(newState));
    } catch (error) {
        console.error(error);
    }
    // console.log(newState)
    // console.log([...newState.favoriteBooks])
    // console.log([...Object.values(newState.libraries)])
};

const getState = (): IStorageData => {
    try {
        const storedState = localStorage.getItem(storageKey);
        if (storedState == null) {
            setState(initialState);
            return initialState;
        }
        return cloneDeep(JSON.parse(storedState));
    } catch (error) {
        console.error(error);
        throw new Error("Failed to get state from localStorage.");
    }
};

const state: IStorageData = getState();

const addFavoriteBook = (isbn: string): void => {
    state.favoriteBooks.push(isbn);
    setState(state);
};

const removeFavoriteBook = (isbn: string): void => {
    const index = state.favoriteBooks.indexOf(isbn);
    if (index !== -1) {
        state.favoriteBooks.splice(index, 1);
        setState(state);
    }
};

const isFavoriteBook = (isbn: string): boolean => {
    return state.favoriteBooks.includes(isbn);
};

const addLibrary = (code: string, name: string): void => {
    state.libraries[code] = name;
    setState(state);
};

const removeLibrary = (code: string): void => {
    delete state.libraries[code];
    setState(state);
};

const hasLibrary = (code: string): boolean => {
    return code in state.libraries;
};

const addRegion = (regionName: string): void => {
    state.regions[regionName] = {};
    setState(state);
};

const removeRegion = (regionName: string): void => {
    delete state.regions[regionName];
    setState(state);
};

const addDetailRegion = (
    regionName: string,
    detailName: string,
    detailCode: string
): void => {
    state.regions[regionName][detailName] = detailCode;
    setState(state);
};

const removeDetailRegion = (regionName: string, detailName: string): void => {
    delete state.regions[regionName][detailName];
    setState(state);
};

export {
    state,
    setState,
    getState,
    addFavoriteBook,
    removeFavoriteBook,
    isFavoriteBook,
    addLibrary,
    removeLibrary,
    hasLibrary,
    addRegion,
    removeRegion,
    addDetailRegion,
    removeDetailRegion,
};
