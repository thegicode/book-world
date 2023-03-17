"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDetailRegion = exports.addDetailRegion = exports.removeRegion = exports.addRegion = exports.hasLibrary = exports.removeLibrary = exports.addLibrary = exports.isFavoriteBook = exports.removeFavoriteBook = exports.addFavoriteBook = exports.getState = exports.setState = exports.state = void 0;
const cloneDeep = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};
const initialState = {
    favoriteBooks: [],
    libraries: {},
    regions: {}
};
const storageKey = 'BookWorld';
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
exports.setState = setState;
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
        throw new Error('Failed to get state from localStrage.');
    }
};
exports.getState = getState;
const state = getState();
exports.state = state;
const addFavoriteBook = (isbn) => {
    state.favoriteBooks.push(isbn);
    setState(state);
};
exports.addFavoriteBook = addFavoriteBook;
const removeFavoriteBook = (isbn) => {
    const index = state.favoriteBooks.indexOf(isbn);
    if (index !== -1) {
        state.favoriteBooks.splice(index, 1);
        setState(state);
    }
};
exports.removeFavoriteBook = removeFavoriteBook;
const isFavoriteBook = (isbn) => {
    return state.favoriteBooks.includes(isbn);
};
exports.isFavoriteBook = isFavoriteBook;
const addLibrary = (code, name) => {
    state.libraries[code] = name;
    setState(state);
};
exports.addLibrary = addLibrary;
const removeLibrary = (code) => {
    delete state.libraries[code];
    setState(state);
};
exports.removeLibrary = removeLibrary;
const hasLibrary = (code) => {
    return code in state.libraries;
};
exports.hasLibrary = hasLibrary;
const addRegion = (regionName) => {
    state.regions[regionName] = {};
    setState(state);
};
exports.addRegion = addRegion;
const removeRegion = (regionName) => {
    delete state.regions[regionName];
    setState(state);
};
exports.removeRegion = removeRegion;
const addDetailRegion = (regionName, detailName, detailCode) => {
    state.regions[regionName][detailName] = detailCode;
    setState(state);
};
exports.addDetailRegion = addDetailRegion;
const removeDetailRegion = (regionName, detailName) => {
    delete state.regions[regionName][detailName];
    setState(state);
};
exports.removeDetailRegion = removeDetailRegion;
//# sourceMappingURL=model.js.map