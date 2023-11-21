export default class Library {
    constructor(libraries) {
        this.libraries = libraries;
    }
    get() {
        return Object.assign({}, this.libraries);
    }
    set(newLibries) {
        this.libraries = newLibries;
    }
    add(code, name) {
        this.libraries[code] = name;
    }
    remove(code) {
        delete this.libraries[code];
    }
    has(code) {
        return code in this.libraries;
    }
}
//# sourceMappingURL=Library.js.map