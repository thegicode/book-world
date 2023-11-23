export default class LibraryModel {
    private _libraries: TLibraries;

    constructor(libraries: TLibraries) {
        this._libraries = libraries;
    }

    get libraries() {
        return { ...this._libraries };
    }

    set libraries(newLibries: TLibraries) {
        this._libraries = newLibries;
    }

    add(code: string, name: string) {
        this._libraries[code] = name;
    }

    remove(code: string) {
        delete this._libraries[code];
    }

    has(code: string) {
        return code in this._libraries;
    }
}
