import Publisher from "@/utils/Publisher";

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

    add(code: string, data: ILibraryData) {
        this._libraries[code] = data;
        this.publisher.notify({
            type: "add",
            payload: {
                code,
                // name,
                data,
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

    public getUpdatePublisher(): Publisher<TLibraryUpdateProps> {
        return this.publisher;
    }
}
