import Publisher from "@/utils/Publisher";

export default class LibraryModel {
    private _libraries: TLibraries;
    private _libraryOrder: string[];
    private publisher: Publisher<TLibraryUpdateProps> = new Publisher();

    constructor(libraries: TLibraries, libraryOrder: string[] = []) {
        this._libraries = libraries;
        this._libraryOrder = libraryOrder;
    }

    get libraries() {
        return { ...this._libraries };
    }

    set libraries(newLibries: TLibraries) {
        this._libraries = newLibries;
    }

    get libraryOrder() {
        return [...this._libraryOrder];
    }

    set libraryOrder(newOrder: string[]) {
        this._libraryOrder = newOrder;
    }

    add(code: string, data: ILibraryData) {
        this._libraries[code] = data;
        if (!this._libraryOrder.includes(code)) {
            this._libraryOrder.push(code);
        }
        
        this.publisher.notify({
            type: "add",
            payload: {
                code,
                data,
            },
        });
    }

    remove(code: string) {
        delete this._libraries[code];
        this._libraryOrder = this._libraryOrder.filter((c) => c !== code);

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
