const cloneDeep = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};
const initialState = {
    favoriteBooks: [],
    libraries: {},
    regions: {},
};
const storageKey = "BookWorld";
const setState = (newState) => {
    try {
        localStorage.setItem(storageKey, JSON.stringify(newState));
    }
    catch (error) {
        console.error(error);
    }
    // console.log(newState)
    // console.log([...newState.favoriteBooks])
    // console.log([...Object.values(newState.libraries)])
};
const getState = () => {
    try {
        const storedState = localStorage.getItem(storageKey);
        if (storedState == null) {
            setState(initialState);
            return initialState;
        }
        return cloneDeep(JSON.parse(storedState));
    }
    catch (error) {
        console.error(error);
        throw new Error("Failed to get state from localStorage.");
    }
};
const state = getState();
const addFavoriteBook = (isbn) => {
    state.favoriteBooks.push(isbn);
    setState(state);
};
const removeFavoriteBook = (isbn) => {
    const index = state.favoriteBooks.indexOf(isbn);
    if (index !== -1) {
        state.favoriteBooks.splice(index, 1);
        setState(state);
    }
};
const isFavoriteBook = (isbn) => {
    return state.favoriteBooks.includes(isbn);
};
const addLibrary = (code, name) => {
    state.libraries[code] = name;
    setState(state);
};
const removeLibrary = (code) => {
    delete state.libraries[code];
    setState(state);
};
const hasLibrary = (code) => {
    return code in state.libraries;
};
const addRegion = (regionName) => {
    state.regions[regionName] = {};
    setState(state);
};
const removeRegion = (regionName) => {
    delete state.regions[regionName];
    setState(state);
};
const addDetailRegion = (regionName, detailName, detailCode) => {
    state.regions[regionName][detailName] = detailCode;
    setState(state);
};
const removeDetailRegion = (regionName, detailName) => {
    delete state.regions[regionName][detailName];
    setState(state);
};
export { state, setState, getState, addFavoriteBook, removeFavoriteBook, isFavoriteBook, addLibrary, removeLibrary, hasLibrary, addRegion, removeRegion, addDetailRegion, removeDetailRegion, };
//# sourceMappingURL=model.js.map