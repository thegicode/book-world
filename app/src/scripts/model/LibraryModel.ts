import Publisher from "../utils/Publisher";

export default class LibraryModel {
    private _libraries: TLibraries;
    private publisher: Publisher<TLibraryUpdateProps> = new Publisher();

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
        this.publisher.notify({
            type: "add",
            payload: {
                code,
                name,
            },
        });
    }

    remove(code: string) {
        delete this._libraries[code];
        this.publisher.notify({
            type: "delete",
            payload: {
                code,
            },
        });
    }

    has(code: string) {
        return code in this._libraries;
    }

    subscribeUpdate(subscriber: TLibrarysUpdateSubscriber) {
        this.publisher.subscribe(
            subscriber as TSubscriberCallback<TLibraryUpdateProps>
        );
    }

    unsubscribeUpdate(subscriber: TLibrarysUpdateSubscriber) {
        this.publisher.subscribe(
            subscriber as TSubscriberCallback<TLibraryUpdateProps>
        );
    }
}
