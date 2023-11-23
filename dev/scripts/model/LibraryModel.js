export default class LibraryModel {
    constructor(libraries) {
        this._libraries = libraries;
    }
    get libraries() {
        return Object.assign({}, this._libraries);
    }
    set libraries(newLibries) {
        this._libraries = newLibries;
    }
    add(code, name) {
        this._libraries[code] = name;
    }
    remove(code) {
        delete this._libraries[code];
    }
    has(code) {
        return code in this._libraries;
    }
}
//# sourceMappingURL=LibraryModel.js.map