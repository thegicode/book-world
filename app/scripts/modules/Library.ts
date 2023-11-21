export default class Library {
    private libraries: TLibraries;

    constructor(libraries: TLibraries) {
        this.libraries = libraries;
    }

    get() {
        return { ...this.libraries };
    }

    set(newLibries: TLibraries) {
        this.libraries = newLibries;
    }

    add(code: string, name: string) {
        this.libraries[code] = name;
    }

    remove(code: string) {
        delete this.libraries[code];
    }

    has(code: string) {
        return code in this.libraries;
    }
}
