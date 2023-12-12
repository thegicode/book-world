import Publisher from "../utils/Publisher";
export default class LibraryModel {
    constructor(libraries) {
        this.publisher = new Publisher();
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
        this.publisher.notify({
            type: "add",
            payload: {
                code,
                name,
            },
        });
    }
    remove(code) {
        delete this._libraries[code];
        this.publisher.notify({
            type: "delete",
            payload: {
                code,
            },
        });
    }
    has(code) {
        return code in this._libraries;
    }
    subscribeUpdate(subscriber) {
        this.publisher.subscribe(subscriber);
    }
    unsubscribeUpdate(subscriber) {
        this.publisher.subscribe(subscriber);
    }
}
//# sourceMappingURL=LibraryModel.js.map