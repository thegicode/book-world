import {
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
} from "../../scripts/modules/model";

describe("BookWrold State management.", () => {
    const storageKey = "BookWorld";

    // const initialState = {
    //     favoriteBooks: [],
    //     libraries: {},
    //     regions: {},
    // };

    afterEach(() => {
        localStorage.clear();
    });

    test("setState updates the state in localStorage", () => {
        const newState = {
            favoriteBooks: ["12345"],
            libraries: { 11111: "홍길동도서관" },
            regions: { 서울: { 강산구: "22222" } },
        };
        setState(newState);
        const storedState = JSON.parse(localStorage.getItem(storageKey) || "");
        expect(storedState).toEqual(newState);
    });

    test("setState handles error when localStorage is not available", () => {
        const newState = {
            favoriteBooks: ["12345"],
            libraries: { 11111: "홍길동도서관" },
            regions: { 서울: { 강산구: "22222" } },
        };

        const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
        setItemSpy.mockImplementation(() => {
            throw new Error("Failed to set states");
        });

        const consoleErrorSpy = jest.spyOn(console, "error");
        consoleErrorSpy.mockImplementation(jest.fn());

        setState(newState);
        expect(consoleErrorSpy).toHaveBeenCalled();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            new Error("Failed to set states")
        );

        setItemSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    test("getState return a default state when localStorage is empty", () => {
        expect(getState()).toEqual({
            favoriteBooks: [],
            libraries: {},
            regions: {},
        });
    });

    test("getState handles error when localStorage is not available", () => {
        const getItemSpy = jest.spyOn(Storage.prototype, "getItem");
        getItemSpy.mockImplementation(() => {
            throw new Error("Failed to get state from localStorage.");
        });

        const consoleErrorSpy = jest.spyOn(console, "error");
        consoleErrorSpy.mockImplementation(jest.fn());

        expect(() => {
            getState();
        }).toThrowError("Failed to get state from localStorage.");

        expect(consoleErrorSpy).toHaveBeenCalled();
        expect(consoleErrorSpy).toHaveBeenLastCalledWith(
            new Error("Failed to get state from localStorage.")
        );

        getItemSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    test("getState returns stored state when available in localStorage", () => {
        const storedState = {
            favoriteBooks: ["12345"],
            libraries: { 11111: "홍길동도서관" },
            regions: { 서울: { 강산구: "22222" } },
        };

        localStorage.setItem(storageKey, JSON.stringify(storedState));
        const result = getState();

        expect(result).toEqual(storedState);
    });

    test("addFavorite and revmoveFavorite work as expected", () => {
        addFavoriteBook("12345");
        expect(isFavoriteBook("12345")).toBeTruthy();
        removeFavoriteBook("12345");
        expect(isFavoriteBook("12345")).toBeFalsy();
    });

    test("addLIbrary and removeLibrary work as expected", () => {
        addLibrary("library1", "library2");
        expect(hasLibrary("library1")).toBeTruthy();
        removeLibrary("library1");
        expect(hasLibrary("library1")).toBeFalsy();
    });

    test("addRegion and removeRegion work as a expected", () => {
        addRegion("Region 1");
        expect(state.regions).toHaveProperty("Region 1");
        removeRegion("Region 1");
        expect(state.regions).not.toHaveProperty("Region 1");
    });

    test("addDetailRegion and removeDetailRegion work as expected", () => {
        addRegion("Region 1");
        addDetailRegion("Region 1", "Detail 1", "a");
        expect(state.regions["Region 1"]).toHaveProperty("Detail 1");
        removeDetailRegion("Region 1", "Detail 1");
        expect(state.regions["Region 1"]).not.toHaveProperty("Detail 1");
    });
});
