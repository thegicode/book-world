const cloneDeep = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};
const initialState = {
    libraries: {},
    regions: {},
    category: {},
    categorySort: [],
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
const addCategory = (name) => {
    state.category[name] = [];
    state.categorySort.push(name);
    setState(state);
};
const hasCategory = (name) => {
    return name in state.category;
};
const renameCategory = (name, newName) => {
    const index = state.categorySort.indexOf(name);
    state.categorySort[index] = newName;
    state.category[newName] = state.category[name];
    delete state.category[name];
    setState(state);
};
const deleteCategory = (name) => {
    state.categorySort = state.categorySort.filter((item) => item !== name);
    delete state.category[name];
    setState(state);
};
const changeCategory = (draggedKey, targetKey) => {
    const draggedIndex = state.categorySort.indexOf(draggedKey);
    const targetIndex = state.categorySort.indexOf(targetKey);
    const sortData = [...state.categorySort];
    sortData[targetIndex] = draggedKey;
    sortData[draggedIndex] = targetKey;
    state.categorySort = sortData;
    setState(state);
};
const addBookInCategory = (name, isbn) => {
    state.category[name].unshift(isbn);
    setState(state);
};
const hasBookInCategory = (name, isbn) => {
    return state.category[name].includes(isbn);
};
const removeBookInCategory = (name, isbn) => {
    const index = state.category[name].indexOf(isbn);
    if (index !== -1) {
        state.category[name].splice(index, 1);
        setState(state);
    }
};
const getBookSizeInCategory = () => {
    function getTotalItemCount(data) {
        return Object.values(data).reduce((sum, currentArray) => sum + currentArray.length, 0);
    }
    return getTotalItemCount(state.category);
};
export { state, setState, getState, addLibrary, removeLibrary, hasLibrary, addRegion, removeRegion, addDetailRegion, removeDetailRegion, addCategory, hasCategory, renameCategory, deleteCategory, changeCategory, addBookInCategory, hasBookInCategory, removeBookInCategory, getBookSizeInCategory, };
//# sourceMappingURL=model.js.map